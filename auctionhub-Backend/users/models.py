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

@receiver(post_save,sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        if hasattr(instance,'profile'):
            instance.profile.save()