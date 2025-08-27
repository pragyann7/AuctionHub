from django.contrib import admin
from .models import Profile, SellerProfile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'is_seller')
    search_fields = ('user__username', 'user__email', 'phone_number')
    list_filter = ('is_seller',)

@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'user', 'verified')
    search_fields = ('shop_name', 'user__username')
    list_filter = ('verified',)
