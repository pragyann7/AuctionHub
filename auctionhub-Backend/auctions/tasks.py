import logging

from django.forms import DurationField
from django.utils import timezone
from celery import shared_task
from django.apps import apps
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import F, ExpressionWrapper, DateTimeField
logger = logging.getLogger(__name__)


@shared_task
def assign_winners_task(product_id):
    """
    Assign winner for a single auction product.
    """
    AuctionProduct = apps.get_model("products", "AuctionProduct")
    Bid = apps.get_model("auctions", "Bid")
    Winner = apps.get_model("auctions", "Winner")
    channel_layer = get_channel_layer()

    try:
        product = AuctionProduct.objects.get(id=product_id)
    except AuctionProduct.DoesNotExist:
        logger.warning(f"Auction product {product_id} does not exist")
        return

    # Skip if winner already exists or auction marked unsold
    if Winner.objects.filter(product=product).exists() or product.is_unsold:
        logger.info(f"Winner already assigned or auction unsold for product {product_id}")
        return

    # Get highest bid
    last_bid = product.bids.order_by('-total_amount', '-bid_time').first()

    if last_bid:
        winner = Winner.objects.create(
            product=product,
            user=last_bid.user,
            final_price=last_bid.total_amount,
            winning_time=timezone.now()
        )
        logger.info(f"Winner assigned: {winner.user.username} for product {product.id}")

        # Notify WebSocket group
        async_to_sync(channel_layer.group_send)(
            f"auction_{product.id}",
            {
                'type': 'auction_end',
                'user': winner.user.username,
                'final_price': float(winner.final_price),
            }
        )
    else:
        # Mark auction as unsold
        product.is_unsold = True
        product.save()
        logger.info(f"No bids: auction marked unsold for product {product.id}")


@shared_task
def assign_all_ended_auctions():
    """
    Loop through all auctions that have ended (using Python property)
    and assign winners automatically.
    """
    AuctionProduct = apps.get_model("products", "AuctionProduct")
    now = timezone.now()

    # Filter active auctions in DB
    active_auctions = AuctionProduct.objects.filter(is_unsold=False, winner__isnull=True)

    # Filter ended auctions in Python
    ended_auctions = [a for a in active_auctions if a.auction_end_datetime and a.auction_end_datetime <= now]

    for auction in ended_auctions:
        assign_winners_task.delay(auction.id)


@shared_task
def check_auctions():
    """
    Periodic task to check ended auctions and trigger winner assignment.
    """
    assign_all_ended_auctions.delay()
    logger.info("Triggered assign_all_ended_auctions task")
