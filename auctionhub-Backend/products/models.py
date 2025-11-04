
#products/smodels.py
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.contrib.auth.models import User



class AuctionProduct(models.Model):

    CONDITION_CHOICES = [
    ('new', 'New'),
    ('used', 'Used'),
    ('refurbished', 'Refurbished'),
]
    
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='products', null=True, blank=True
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, blank=True, null=True)
    
    starting_price = models.DecimalField(max_digits=10, decimal_places=2) #initial price doesn't change
    buy_now_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    bid_increment = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True) #value always stay same throughout auction and this will help in auctions to increase current price
    #at initial auction if someone bid, totalamount = starting_price + bid_increment and in another bid total amount + prev total amt + bid_increment

    
    auction_start_datetime = models.DateTimeField(blank=True, null=True)
    auction_duration = models.PositiveIntegerField(blank=True, null=True)
    auto_relist = models.BooleanField(default=False)
    relist_count = models.PositiveIntegerField(default=0)
    max_relist = models.PositiveIntegerField(default=8)

    
    shipping_options = models.CharField(max_length=255, blank=True, null=True)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    shipping_country = models.CharField(max_length=100, blank=True, null=True)
    shipping_district = models.CharField(max_length=100, blank=True, null=True)
    shipping_location = models.CharField(max_length=255, blank=True, null=True)
    shipping_estimate = models.CharField(max_length=100, blank=True, null=True)
    shipping_handling = models.CharField(max_length=100, blank=True, null=True)
    courier_option = models.CharField(max_length=100, blank=True, null=True)
    
    pickup_point = models.CharField(max_length=255, blank=True, null=True)
    return_policy = models.TextField(blank=True, null=True)
    auction_terms = models.TextField(blank=True, null=True)
    payment_terms = models.TextField(blank=True, null=True)
    shipping_terms = models.TextField(blank=True, null=True)
    warranty_terms = models.TextField(blank=True, null=True)
    has_warranty = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)

    # Winner & unsold
    winner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='won_products'  # <-- explicit reverse name
    )
    is_unsold = models.BooleanField(default=False)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def delete(self, *args, **kwargs):
        for img in self.images.all():
            img.image.delete(save=False)
        super().delete(*args, **kwargs)


    @property
    def auction_end_datetime(self):
        if self.auction_start_datetime and self.auction_duration:
            return self.auction_start_datetime + timedelta(minutes=self.auction_duration)
        return None
    
    @property
    def default_image_url(self):
        first = self.images.first()
        if first:
            return first.image.url
        return '/media/products/default.jpeg'

    @property
    def status(self):
        now = timezone.now()
        end_time = self.auction_end_datetime

        if self.winner:
            return "sold"
        if self.is_unsold:
            return "unsold"
        if self.auction_start_datetime and now < self.auction_start_datetime:
            return "upcoming"
        if end_time and now < end_time:
            return "live"
        return "ended"


class AuctionProductImage(models.Model):
    product = models.ForeignKey(AuctionProduct, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
