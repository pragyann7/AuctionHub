import random
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import EmailOTP

def send_email_otp(user):
    code = str(random.randint(100000, 999999))
    now = timezone.now()

    otp_obj, created = EmailOTP.objects.update_or_create(
        user=user,
        defaults={
            'code': code,
            'created_at': now,
            'expires_at': now + timedelta(minutes=10)
        }
    )

    send_mail(
        subject="Your AuctionHub verification code",
        message=f"Hello {user.username},\n\nYour verification code is: {code}\nIt will expire in 10 minutes.",
        from_email=None,
        recipient_list=[user.email],
        fail_silently=False,
    )
