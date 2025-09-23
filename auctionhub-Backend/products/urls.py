from django.urls import path
from .views import AuctionProductListCreateAPIView, AuctionProductDetailAPIView, WishlistListCreateAPIView, WishlistDestroyAPIView

urlpatterns = [
    path('AFauctions/', AuctionProductListCreateAPIView.as_view(), name='auction-list'),
    path('auctions/<int:pk>/', AuctionProductDetailAPIView.as_view(), name='auction-detail'),
    path("wishlist/", WishlistListCreateAPIView.as_view(), name="wishlist-list-create"),
    path("wishlist/<int:pk>/", WishlistDestroyAPIView.as_view(), name="wishlist-delete"),
]
