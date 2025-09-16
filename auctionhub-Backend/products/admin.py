from django.contrib import admin
from .models import AuctionProduct

@admin.register(AuctionProduct)
class AuctionProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'auction_start_datetime', 'auction_duration', 'starting_price')
