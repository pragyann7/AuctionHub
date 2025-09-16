from rest_framework import generics
from .models import AuctionProduct, AuctionProductImage
from .serializers import AuctionProductSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated


class AuctionProductListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = AuctionProduct.objects.all()
    serializer_class = AuctionProductSerializer

    def perform_create(self, serializer):
        product = serializer.save()
        images = self.request.FILES.getlist('images')
        for image in images:
            AuctionProductImage.objects.create(product=product, image=image)


class AuctionProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuctionProduct.objects.all()
    serializer_class = AuctionProductSerializer
