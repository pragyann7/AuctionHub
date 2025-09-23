from datetime import timedelta
from django.utils import timezone
from django.db.models import (
    F, Q, Value, Case, When, ExpressionWrapper, DateTimeField, IntegerField
)
from django.db.models.functions import Coalesce
from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.cache import cache
from .models import AuctionProduct, AuctionProductImage, Wishlist
from .serializers import AuctionProductSerializer, WishlistSerializer


class AuctionProductListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = AuctionProductSerializer
    queryset = AuctionProduct.objects.all()
    

    def get_queryset(self):
        queryset = AuctionProduct.objects.all()
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
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(category__icontains=search_query) |
                Q(condition__icontains=search_query)
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


        queryset = queryset.annotate(
            auction_end_dt=ExpressionWrapper(
                F('auction_start_datetime') + Coalesce(F('auction_duration'), 0) * timedelta(hours=1),
                output_field=DateTimeField()
            )
        )

        now = timezone.now()

        queryset = queryset.annotate(
            auction_status_order=Case(
                When(
                    auction_start_datetime__lte=now,
                    auction_end_dt__gte=now,
                    then=Value(1) 
                ),
                When(
                    auction_start_datetime__gt=now,
                    then=Value(2)  
                ),
                default=Value(3),  
                output_field=IntegerField()
            )
        ).order_by('auction_status_order', '-auction_start_datetime')

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
        cache_key = (
            "auction_product_list_" + "_".join(f"{k}:{v}" for k, v in sorted(params.items()))
            if params else "auction_product_list_all"
        )

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
        cache_key = f"single_auction_product_{pk}_{request.user.id if request.user.is_authenticated else 'anon'}"

        AuctionProduct.objects.filter(pk=pk).update(view_count=F('view_count') + 1)

        data = cache.get(cache_key)
        if not data:
            obj = self.get_object()
            serializer = self.get_serializer(obj)
            data = serializer.data
            cache.set(cache_key, data, timeout=60)
        else:
            obj = self.get_object()
            data['view_count'] = obj.view_count
            data['is_wishlisted'] = obj.wishlisted_by.filter(user=request.user).exists() if request.user.is_authenticated else False

        return Response(data)

    def perform_update(self, serializer):
        instance = serializer.save()
        cache.delete(f"single_auction_product_{instance.pk}")
        for key in cache.keys("auction_product_list_*"):
            cache.delete(key)
        return instance

    def perform_destroy(self, instance):
        pk = instance.pk
        super().perform_destroy(instance)
        cache.delete(f"single_auction_product_{pk}")
        for key in cache.keys("auction_product_list_*"):
            cache.delete(key)



class WishlistListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        wishlist_item = serializer.save(user=self.request.user)


        cache_key = f"single_auction_product_{wishlist_item.product.id}_{self.request.user.id}"
        cache.delete(cache_key)


        for key in cache.keys("auction_product_list_*"):
            cache.delete(key)



class WishlistDestroyAPIView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Wishlist.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        product_id = instance.product.id
        user_id = instance.user.id

        response = super().destroy(request, *args, **kwargs)


        cache_key = f"single_auction_product_{product_id}_{user_id}"
        cache.delete(cache_key)


        for key in cache.keys("auction_product_list_*"):
            cache.delete(key)

        return response
