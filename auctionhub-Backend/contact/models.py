from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.utils.html import strip_tags
from django.contrib.auth.models import User

def validate_file(file):
    allowed_types = ['image/png', 'image/jpeg', 'application/pdf', 'image/gif', 'image/svg+xml']
    max_size = 5 * 1024 * 1024  # 5 MB
    if file.content_type not in allowed_types:
        raise ValidationError("Unsupported file type.")
    if file.size > max_size:
        raise ValidationError("File too large.")

class ContactMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contact_messages")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(
        max_length=15,
        blank=True,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$')]
    )
    message = models.TextField(max_length=2000)
    file = models.FileField(upload_to="contact_files/", blank=True, null=True, validators=[validate_file])
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.message = strip_tags(self.message)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email} (User: {self.user.username})"
