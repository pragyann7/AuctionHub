from django.urls import path
from .views import AuctionProductListCreateAPIView, AuctionProductDetailAPIView

urlpatterns = [
    path('AFauctions/', AuctionProductListCreateAPIView.as_view(), name='auction-list'),
    path('auctions/<int:pk>/', AuctionProductDetailAPIView.as_view(), name='auction-detail'),
]
