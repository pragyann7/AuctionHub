# auctions/views.py
from rest_framework import generics
from products.models import AuctionProduct

class AuctionProductDetailView(generics.RetrieveAPIView):
    queryset = AuctionProduct.objects.all()

    def get_serializer_class(self):
        # Import here only when this method is called
        from products.serializers import AuctionProductSerializer
        return AuctionProductSerializer
