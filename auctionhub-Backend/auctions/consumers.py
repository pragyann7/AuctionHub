# auctions/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from products.models import AuctionProduct
from .models import Bid
from django.contrib.auth import get_user_model

User = get_user_model()


class AuctionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.product_id = self.scope['url_route']['kwargs']['product_id']
        self.group_name = f'auction_{self.product_id}'

        # Add this websocket to the auction group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Remove this websocket from the auction group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """Receive bid from WebSocket and broadcast to group."""
        data = json.loads(text_data)
        user = self.scope["user"]
        amount = data.get("amount")

        if not user.is_authenticated:
            await self.send(text_data=json.dumps({"error": "Authentication required"}))
            return

        # Soft check: amount must be positive
        if amount is None or float(amount) <= 0:
            await self.send(text_data=json.dumps({"error": "Invalid bid amount"}))
            return

        bid = await self.create_bid(user, self.product_id, amount)

        # Broadcast the bid to all clients in the group
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'bid_message',
                'user': user.username,
                'amount': str(amount),
                'bid_time': str(bid.bid_time)
            }
        )

    async def bid_message(self, event):
        """Send bid update to WebSocket client."""
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def create_bid(self, user, product_id, amount):
        """Create a bid for the given product."""
        product = AuctionProduct.objects.get(id=product_id)

        # Mark previous highest bid as not winning
        Bid.objects.filter(product=product, is_winning=True).update(is_winning=False)

        # Create new winning bid
        bid = Bid.objects.create(
            product=product,
            user=user,
            amount=amount,
            is_winning=True
        )
        return bid
