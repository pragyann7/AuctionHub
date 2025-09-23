# auctions/consumers.py
import json
import logging
from decimal import Decimal, InvalidOperation

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone

logger = logging.getLogger(__name__)

class AuctionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.auction_id = self.scope['url_route']['kwargs']['auction_id']
        self.auction_group_name = f'auction_{self.auction_id}'

        await self.channel_layer.group_add(
            self.auction_group_name,
            self.channel_name
        )
        await self.accept()
        await self.send_auction_state()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.auction_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(json.dumps({'type': 'error', 'message': 'Invalid JSON data.'}))
            return

        action = data.get('action')
        if action == 'bid':
            await self.handle_bid(data)
        elif action == 'end_auction':
            await self.handle_end_auction()

    async def handle_bid(self, data):
        user = await self.get_user_from_scope()
        if not user:
            await self.send(json.dumps({'type': 'error', 'message': 'Authentication failed.'}))
            return

        amount = data.get('amount')
        try:
            bid_info = await self.create_bid(user, amount_from_client=amount)
        except ValueError as e:
            await self.send(json.dumps({'type': 'error', 'message': str(e)}))
            return

        await self.channel_layer.group_send(
            self.auction_group_name,
            {
                'type': 'auction_update',
                'user': bid_info['user'],
                'amount': bid_info['amount'],
                'total_amount': bid_info['total_amount'],
            }
        )

    async def handle_end_auction(self):
        await self.close_auction()
        await self.send(json.dumps({'type': 'info', 'message': 'Auction ended, calculating winner...'}))

    # -------------------- Broadcast Handlers --------------------

    async def auction_update(self, event):
        await self.send(json.dumps({
            'type': 'update',
            'user': event['user'],
            'amount': event['amount'],
            'total_amount': event['total_amount'],
        }))

    async def auction_end(self, event):
        """Triggered by Celery after winner is assigned"""
        await self.send(json.dumps({
            'type': 'end',
            'winner': event['user'],
            'final_price': float(event.get('final_price', 0)),
        }))
        # Close WebSocket after sending auction end
        await self.close()

    # -------------------- Database Helpers --------------------

    @database_sync_to_async
    def get_user_from_scope(self):
        from django.contrib.auth import get_user_model
        from rest_framework_simplejwt.tokens import UntypedToken
        import jwt
        from django.conf import settings

        User = get_user_model()
        try:
            query_string = self.scope['query_string'].decode()
            if "token=" not in query_string:
                return None
            token = query_string.split("token=")[-1]
            UntypedToken(token)
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return User.objects.get(id=payload['user_id'])
        except Exception as e:
            logger.warning(f"Failed to get user from scope: {e}")
            return None

    @database_sync_to_async
    def create_bid(self, user, amount_from_client=None):
        from django.apps import apps

        AuctionProduct = apps.get_model("products", "AuctionProduct")
        Bid = apps.get_model("auctions", "Bid")

        try:
            product = AuctionProduct.objects.get(id=self.auction_id)
        except AuctionProduct.DoesNotExist:
            raise ValueError("Auction product not found.")

        now = timezone.now()
        if product.auction_end_datetime and now > product.auction_end_datetime:
            raise ValueError("Auction already ended.")

        last_bid = product.bids.order_by('-bid_time').first()
        current_total = last_bid.total_amount if last_bid else product.starting_price

        max_increment = product.bid_increment or Decimal("0")
        if max_increment <= 0:
            raise ValueError("Invalid bid increment set for this auction.")

        try:
            bid_amount = Decimal(str(amount_from_client))
        except (ValueError, InvalidOperation):
            raise ValueError(f"Invalid bid amount: {amount_from_client}")

        if bid_amount <= 0:
            raise ValueError("Bid must be greater than 0.")
        if bid_amount > max_increment:
            raise ValueError(f"Bid cannot exceed the maximum allowed increment of {max_increment}.")

        total_amount = current_total + bid_amount

        bid = Bid.objects.create(
            product=product,
            user=user,
            amount=bid_amount,
            total_amount=total_amount
        )

        return {
            "user": user.username,
            "amount": str(bid.amount),
            "total_amount": str(bid.total_amount),
        }

    @database_sync_to_async
    def close_auction(self):
        from django.apps import apps
        AuctionProduct = apps.get_model("products", "AuctionProduct")
        Winner = apps.get_model("auctions", "Winner")
        from auctions.tasks import assign_winners_task

        try:
            product = AuctionProduct.objects.get(id=self.auction_id)
            now = timezone.now()

            if product.auction_end_datetime and now >= product.auction_end_datetime:
                if not Winner.objects.filter(product=product).exists():
                    assign_winners_task.delay(product.id)
        except AuctionProduct.DoesNotExist:
            return

    @database_sync_to_async
    def get_full_auction_state(self):
        from django.apps import apps
        AuctionProduct = apps.get_model("products", "AuctionProduct")
        Winner = apps.get_model("auctions", "Winner")

        try:
            product = AuctionProduct.objects.get(id=self.auction_id)
        except AuctionProduct.DoesNotExist:
            return None

        last_bid = product.bids.order_by('-bid_time').first()
        current_bid = last_bid.total_amount if last_bid else product.starting_price

        bids_history = [
            {'user': b.user.username, 'amount': str(b.amount), 'total': str(b.total_amount)}
            for b in product.bids.order_by('bid_time')
        ]
        now = timezone.now()
        auction_ended = product.auction_end_datetime and now >= product.auction_end_datetime

        winner_final_price = None
        if product.winner:
            last_winning_bid = product.bids.filter(user=product.winner).order_by('-bid_time').first()
            winner_final_price = last_winning_bid.total_amount if last_winning_bid else current_bid

        return {
            'current_bid': str(current_bid),
            'bids': bids_history,
            'auction_status': product.status,
            'auction_end_datetime': product.auction_end_datetime.isoformat() if product.auction_end_datetime else None,
            'winner': product.winner.username if product.winner else None,
            'winner_final_price': str(winner_final_price) if winner_final_price else None,
            'auction_ended': auction_ended,
        }

    async def send_auction_state(self):
        state = await self.get_full_auction_state()
        if state:
            await self.send(json.dumps({'type': 'state', **state}))
