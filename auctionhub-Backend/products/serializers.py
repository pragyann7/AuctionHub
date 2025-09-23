# products/seriailzers.py
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
    winner_name = serializers.SerializerMethodField()
    winner_final_price = serializers.SerializerMethodField()
    status = serializers.ReadOnlyField()  # uses model property
    auction_ended = serializers.SerializerMethodField()
    seller_id = serializers.IntegerField(source='seller.id', read_only=True)
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    seller_profile_photo = serializers.SerializerMethodField()
    view_count = serializers.IntegerField(read_only=True)
    

    class Meta:
        model = AuctionProduct
        fields = '__all__'

    def get_seller_profile_photo(self, obj):
        """Return full URL of seller profile picture if exists."""
        seller = obj.seller
        if seller and hasattr(seller, 'profile') and seller.profile.profile_picture:
            request = self.context.get('request')
            url = seller.profile.profile_picture.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None
    
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

    def get_winner_name(self, obj):
        if obj.status == "ended" and obj.winner:
            return obj.winner.username
        return None

    def get_auction_ended(self, obj):
        return obj.status == "ended"

    def get_winner_final_price(self, obj):
        if obj.winner:
            # Check if Winner entry exists
            winner_entry = getattr(obj, 'winner_entries', None)
            if winner_entry:
                return winner_entry.final_price
        return None
