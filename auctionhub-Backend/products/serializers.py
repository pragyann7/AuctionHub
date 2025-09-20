from rest_framework import serializers
from django.utils import timezone
from .models import AuctionProduct, AuctionProductImage

class AuctionProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionProductImage
        fields = ['id', 'image']

class AuctionProductSerializer(serializers.ModelSerializer):
    images = AuctionProductImageSerializer(many=True, read_only=True)
    current_bid = serializers.SerializerMethodField()
    time_left = serializers.SerializerMethodField()
    auction_status = serializers.SerializerMethodField()
    auction_end_datetime = serializers.SerializerMethodField()
    status = serializers.ReadOnlyField()
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
        return obj.starting_price
    
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
