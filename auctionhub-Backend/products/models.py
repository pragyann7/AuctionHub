from django.db import models
from datetime import timedelta


class AuctionProduct(models.Model):

    CONDITION_CHOICES = [
    ('new', 'New'),
    ('used', 'Used'),
    ('refurbished', 'Refurbished'),
]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, blank=True, null=True)
    
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    buy_now_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    bid_increment = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
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
    

class AuctionProductImage(models.Model):
    product = models.ForeignKey(AuctionProduct, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
