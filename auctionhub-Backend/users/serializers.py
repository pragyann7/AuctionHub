from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(
        source='profile.phone_number', allow_blank=True, required=False
    )
    profile_picture = serializers.ImageField(
        source='profile.profile_picture', allow_null=True, required=False
    )

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'phone_number', 'profile_picture','date_joined','last_login'
        ]
        read_only_fields = ['id', 'date_joined','last_login']

    # Validators
    def validate_email(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_profile_picture(self, value):
        max_size = 5 * 1024 * 1024  # 5MB
        if value.size > max_size:
            raise serializers.ValidationError(
                "Profile picture should not exceed 5MB in size."
            )

        valid_types = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml']
        if value.content_type not in valid_types:
            raise serializers.ValidationError(
                "Unsupported file type. Allowed types: png, jpeg, gif, svg."
            )
        return value

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile_data = validated_data.pop('profile', None)
        profile = instance.profile
        if profile_data:
            profile.phone_number = profile_data.get('phone_number', profile.phone_number)
            if 'profile_picture' in profile_data:
                profile.profile_picture = profile_data.get(
                    'profile_picture', profile.profile_picture
                )
            profile.save()

        return instance
