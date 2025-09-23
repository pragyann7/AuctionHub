from django.urls import path
from .views import AuctionProductDetailView

urlpatterns = [
    path('auctions/<int:pk>/', AuctionProductDetailView.as_view(), name='auction-detail'),
]
