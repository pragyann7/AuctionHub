from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Follow
from products.models import AuctionProduct
from django.contrib.auth import get_user_model
from products.models import Wishlist

User = get_user_model()

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
    profile_address = serializers.CharField(
        source='profile.address', allow_blank=True, required=False
    )
    country = serializers.CharField(write_only=True, required=False, allow_blank=True)
    state = serializers.CharField(write_only=True, required=False, allow_blank=True)
    city = serializers.CharField(write_only=True, required=False, allow_blank=True)
    street = serializers.CharField(write_only=True, required=False, allow_blank=True)
    is_seller = serializers.BooleanField(source='profile.is_seller', read_only=True)
    total_products = serializers.SerializerMethodField()
    watchlist_count = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'phone_number', 'profile_picture', 'date_joined', 'last_login',
            'profile_address', 'country', 'state', 'city', 'street', 'is_seller', 'total_products', 'watchlist_count','following', 'followers_count', 'following_count'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


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
        max_size = 5 * 1024 * 1024
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

        profile, _ = Profile.objects.get_or_create(user=instance)
        profile.phone_number = validated_data.get('phone_number', profile.phone_number)

        if 'profile_picture' in validated_data:
            profile.profile_picture = validated_data.get(
                'profile_picture'
            )

        country = validated_data.get('country', "")
        state = validated_data.get('state', "")
        city = validated_data.get('city', "")
        street = validated_data.get('street', "")
        address_parts = [part for part in [ state, city, street, country] if part]
        profile.address = ', '.join(address_parts)

        profile.save()
        return instance

    def get_total_products(self, obj):
        if obj.profile.is_seller: 
            return AuctionProduct.objects.filter(seller=obj).count()
        return 0
    
    def get_watchlist_count(self, obj):
        return Wishlist.objects.filter(user=obj).count()
    
    def get_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:

            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False



    def get_followers_count(self, obj):
        return Follow.objects.filter(following=obj).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj).count()
    


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']
