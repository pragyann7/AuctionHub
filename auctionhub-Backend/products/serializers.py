#products/seriailzers.py
from rest_framework import serializers
from django.utils import timezone
from .models import AuctionProduct, AuctionProductImage
from auctions.models import Bid


class AuctionProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionProductImage
        fields = ['id', 'image']


class BidSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Bid
        fields = ['id', 'user', 'amount', 'total_amount', 'bid_time', 'is_winning', 'is_auto_bid']


class AuctionProductSerializer(serializers.ModelSerializer):
    images = AuctionProductImageSerializer(many=True, read_only=True)
    bids = BidSerializer(many=True, read_only=True)
    current_bid = serializers.SerializerMethodField()
    time_left = serializers.SerializerMethodField()
    auction_status = serializers.SerializerMethodField()
    auction_end_datetime = serializers.SerializerMethodField()
    status = serializers.ReadOnlyField()  # uses model property

    class Meta:
        model = AuctionProduct
        fields = '__all__'

    def get_current_bid(self, obj):
        # Get highest bid if exists, otherwise starting price
        highest_bid = obj.bids.order_by('-total_amount').first()
        return highest_bid.total_amount if highest_bid else obj.starting_price

    def get_auction_end_datetime(self, obj):
        if obj.auction_end_datetime:
            return obj.auction_end_datetime.isoformat()
        return None

    def get_time_left(self, obj):
        now = timezone.now()

        if obj.auction_start_datetime and now < obj.auction_start_datetime:
            remaining = obj.auction_start_datetime - now
            return self.format_duration(remaining)

        if obj.auction_end_datetime and now < obj.auction_end_datetime:
            remaining = obj.auction_end_datetime - now
            return self.format_duration(remaining)

        return "Ended"

    def get_auction_status(self, obj):
        now = timezone.now()
        if obj.auction_start_datetime and now < obj.auction_start_datetime:
            return "starts_in"
        if obj.auction_end_datetime and now < obj.auction_end_datetime:
            return "ends_in"
        return "ended"

    def format_duration(self, remaining):
        days = remaining.days
        hours, remainder = divmod(remaining.seconds, 3600)
        minutes, _ = divmod(remainder, 60)
        return f"{days}d {hours}h {minutes}m"
