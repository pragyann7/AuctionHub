from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ContactMessage
        fields = "__all__"
        read_only_fields = ["user", "created_at"]

    def validate_message(self, value):
        if len(value) > 2000:
            raise serializers.validationError("Message is too long")
        return value