from rest_framework import generics
from .models import AuctionProduct, AuctionProductImage
from .serializers import AuctionProductSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.cache import cache
from django.utils.timezone import now
from rest_framework.response import Response
from django.db.models import F, Q
from django.db import models

class AuctionProductListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = AuctionProduct.objects.all()
    serializer_class = AuctionProductSerializer


    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        seller_id = params.get("seller_id")
        search_query = params.get("search")
        categories = params.get("category")
        conditions = params.get("condition")
        min_price = params.get("min_price")
        max_price = params.get("max_price")

        if seller_id:
            queryset = queryset.filter(seller_id=seller_id)

        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query)
                | Q(description__icontains=search_query)
                | Q(category__icontains=search_query)
                | Q(condition__icontains=search_query)
            )

        if categories:
            category_list = [c.strip() for c in categories.split(",") if c.strip()]
            if category_list:
                q_obj = Q()
                for cat in category_list:
                    q_obj |= Q(category__iexact=cat)
                queryset = queryset.filter(q_obj)

        if conditions:
            condition_list = [c.strip() for c in conditions.split(",") if c.strip()]
            if condition_list:
                q_obj = Q()
                for cond in condition_list:
                    q_obj |= Q(condition__iexact=cond)
                queryset = queryset.filter(q_obj)

        if min_price:
            queryset = queryset.filter(starting_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(starting_price__lte=max_price)

        return queryset


    def perform_create(self, serializer):
        product = serializer.save(seller=self.request.user)
        images = self.request.FILES.getlist("images")
        for image in images:
            AuctionProductImage.objects.create(product=product, image=image)

        for key in cache.keys("auction_product_list_*"):
            cache.delete(key)

    
    def list(self, request, *args, **kwargs):
        params = request.query_params
        cache_key = "auction_product_list_" + "_".join(
            f"{k}:{v}" for k, v in sorted(params.items())
        ) or "all"

        data = cache.get(cache_key)
        if not data:
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

        # Increment view count atomically
        AuctionProduct.objects.filter(pk=pk).update(view_count=F('view_count') + 1)

        data = cache.get(cache_key)
        if data is None:
            obj = self.get_object()
            serializer = self.get_serializer(obj)
            data = serializer.data
            cache.set(cache_key, data, timeout=60)
        else:
            obj = self.get_object()
            data['view_count'] = obj.view_count

        return Response(data)


    def perform_update(self, serializer):
        instance = serializer.save()
        cache.delete(f"auction_product_{instance.pk}")
        cache.delete('auction_product_list')
        return instance

    def perform_destroy(self, instance):
        pk = instance.pk
        super().perform_destroy(instance)
        cache.delete(f"auction_product_{pk}")
        cache.delete('auction_product_list')