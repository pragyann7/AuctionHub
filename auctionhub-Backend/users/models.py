from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pics/", blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    is_seller = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username



class SellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    shop_name = models.CharField(max_length=100)
    shop_description = models.TextField(blank=True, null=True)
    business_address = models.TextField()
    bank_account = models.CharField(max_length=50)
    verified = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.shop_name} ({self.user.username})"



class Product(models.Model):
    CONDITION_CHOICES = [
        ('New', 'New'),
        ('Used-Good', 'Used - Good'),
        ('Refurbished', 'Refurbished')
    ]
    
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=200)
    description = models.TextField()
    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES)
    category = models.CharField(max_length=100)
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_bid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    auction_end_time = models.DateTimeField()
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_products')
    shipping_cost = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    shipping_method = models.CharField(max_length=100, blank=True)
    payment_methods = models.CharField(max_length=200, blank=True)
    return_policy = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def is_active(self):
        """Check if auction is still active."""
        return timezone.now() < self.auction_end_time

    def save(self, *args, **kwargs):
        """Initialize current_bid with starting_price if not set."""
        if self.current_bid == 0:
            self.current_bid = self.starting_price
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')
    
    def __str__(self):
        return f"{self.product.title} Image"


class Bid(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='bids')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - ${self.amount}"

    def save(self, *args, **kwargs):
        """Validate bid amount and update product's current_bid."""
        if self.amount <= self.product.current_bid:
            raise ValueError("Bid must be higher than the current bid.")
        super().save(*args, **kwargs)
        # Update product current_bid automatically
        self.product.current_bid = self.amount
        self.product.save()

@receiver(post_save,sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        if hasattr(instance,'profile'):
            instance.profile.save()