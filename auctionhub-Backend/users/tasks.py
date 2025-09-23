from celery import shared_task
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import EmailOTP

User = get_user_model()

@shared_task
def delete_expired_otps():
    now = timezone.now()
    expired = EmailOTP.objects.filter(expires_at__lt=now)
    count = expired.count()
    expired.delete()
    return f"Deleted {count} expired OTP(s)."


@shared_task
def delete_unverified_users():

    threshold = timezone.now() - timedelta(days=1)
    unverified_users = User.objects.filter(
        profile__email_verified=False,
        date_joined__lt=threshold,
        is_staff=False,
        is_superuser=False
    )
    count = unverified_users.count()
    unverified_users.delete()
    print(f"Deleted {count} unverified user(s).")
    return f"Deleted {count} unverified user(s)."