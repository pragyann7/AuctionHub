from django.db import models
from django.conf import settings
from django.utils import timezone
from products.models import AuctionProduct


class Bid(models.Model):
    product = models.ForeignKey(
        AuctionProduct,
        related_name='bids',
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='bids',
        on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    bid_time = models.DateTimeField(default=timezone.now)

    is_winning = models.BooleanField(default=False)
    is_auto_bid = models.BooleanField(default=False)

    # Optional: store user's profile info at time of bid for historical purposes
    user_profile_snapshot = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ['-bid_time']
        indexes = [
            models.Index(fields=['product', 'bid_time']),
            models.Index(fields=['user', 'bid_time']),
        ]
        verbose_name = 'Bid'
        verbose_name_plural = 'Bids'

    def __str__(self):
        return f"{self.user.username} bid {self.amount} on {self.product.name}"

    def save(self, *args, **kwargs):
        # Optional: take a snapshot of user's profile at the time of bid
        if not self.user_profile_snapshot:
            profile = getattr(self.user, 'profile', None)
            if profile:
                self.user_profile_snapshot = {
                    'phone_number': profile.phone_number,
                    'profile_picture': profile.profile_picture.url if profile.profile_picture else None,
                }
        super().save(*args, **kwargs)
