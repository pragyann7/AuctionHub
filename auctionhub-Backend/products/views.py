from rest_framework import generics
from .models import AuctionProduct, AuctionProductImage
from .serializers import AuctionProductSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.cache import cache
from django.utils.timezone import now
from rest_framework.response import Response




class AuctionProductListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = AuctionProduct.objects.all()
    serializer_class = AuctionProductSerializer

    def perform_create(self, serializer):
        product = serializer.save()
        images = self.request.FILES.getlist('images')
        for image in images:
            AuctionProductImage.objects.create(product=product, image=image)

        cache_key = f"created_auction_product_{product.pk}"
        # store serialized data for readability
        data = AuctionProductSerializer(product).data
        cache.set(cache_key, data, timeout=60)

        # optional: clear the list cache
        cache.delete('auction_product_list')

    def list(self, request, *args, **kwargs):
        cache_key = "auction_product_list"
        data = cache.get(cache_key)
        if data is None:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            data = serializer.data
            cache.set(cache_key, data, timeout=60)
        return Response(data)



class AuctionProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuctionProduct.objects.all()
    serializer_class = AuctionProductSerializer

    def retrieve(self, request, *args, **kwargs):
        pk = self.kwargs['pk']
        cache_key = f"single_auction_product_{pk}"
        data = cache.get(cache_key)
        if data is None:
            obj = self.get_object()
            serializer = self.get_serializer(obj)
            data = serializer.data
            cache.set(cache_key, data, timeout=60)
        return Response(data)


    def perform_update(self, serializer):
        """
        Invalidate the cache when updating.
        """
        instance = serializer.save()
        cache.delete(f"auction_product_{instance.pk}")
        cache.delete('auction_product_list')
        return instance

    def perform_destroy(self, instance):
        """
        Invalidate the cache when deleting.
        """
        pk = instance.pk
        super().perform_destroy(instance)
        cache.delete(f"auction_product_{pk}")
        cache.delete('auction_product_list')