# auctions/models.py (Bid model)
from django.db import models
from django.conf import settings
from django.utils import timezone
from products.models import AuctionProduct


# auctions/models.py
class Bid(models.Model):
    product = models.ForeignKey(AuctionProduct, related_name='bids', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='bids', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # will always equal bid_increment
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bid_time = models.DateTimeField(default=timezone.now)
    is_winning = models.BooleanField(default=False)
    is_auto_bid = models.BooleanField(default=False)
    user_profile_snapshot = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ['-bid_time']
        indexes = [
            models.Index(fields=['product', 'bid_time']),
            models.Index(fields=['user', 'bid_time']),
        ]

    def __str__(self):
        return f"{self.user.username} bid {self.amount} on {self.product.name} (Total: {self.total_amount})"

    def save(self, *args, **kwargs):
        now = timezone.now()
        end_time = self.product.auction_end_datetime

        # Prevent creating a bid after auction ended
        if end_time and now > end_time:
            raise ValueError("Auction already ended.")

        last_bid = Bid.objects.filter(product=self.product).order_by('-bid_time').first()
        increment_limit = self.product.bid_increment or 0

        # Validate user-provided bid
        if not hasattr(self, 'amount') or self.amount is None:
            raise ValueError("Bid amount is required.")
        if self.amount <= 0 or self.amount > increment_limit:
            raise ValueError(f"Invalid bid: must be >0 and ≤ {increment_limit}")

        # Calculate total_amount
        if last_bid:
            self.total_amount = last_bid.total_amount + self.amount
        else:
            self.total_amount = self.product.starting_price + self.amount

        # Snapshot user profile
        if not self.user_profile_snapshot:
            profile = getattr(self.user, 'profile', None)
            if profile:
                self.user_profile_snapshot = {
                    'phone_number': getattr(profile, 'phone_number', None),
                    'profile_picture': profile.profile_picture.url if getattr(profile, 'profile_picture',
                                                                              None) else None,
                }

        super().save(*args, **kwargs)

        # Update winning bid
        Bid.objects.filter(product=self.product).exclude(id=self.id).update(is_winning=False)
        if not self.is_winning:
            self.is_winning = True
            super().save(update_fields=['is_winning'])


class Winner(models.Model):
    product = models.OneToOneField(
        "products.AuctionProduct",
        on_delete=models.CASCADE,
        related_name="winner_entries"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="auction_wins"
    )
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    winning_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} won {self.product.name} for {self.final_price}"
