from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import Profile, SellerProfile
from .serializers import RegisterSerializer, UserProfileSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Count
from django.contrib.auth import get_user_model



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass

        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    

class UserFetchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

User = get_user_model()

class PublicUserDetailAPIView(generics.RetrieveAPIView):
    """
    Fetch any user's profile by ID. No authentication required if you want it public.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer  # same serializer you use for your own profile

    def get_queryset(self):
        return User.objects.annotate(
            total_products=Count('products')  # 'products' = related_name on AuctionProduct
        )

    
class CheckAvailabilityView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")

        errors = {}

        if username and User.objects.filter(username=username).exists():
            errors["username"] = "Username already exists"

        if email and User.objects.filter(email=email).exists():
            errors["email"] = "Email already exists"

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Available"}, status=status.HTTP_200_OK)

class EditProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user
    

class BecomeSellerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = request.user.profile
        shop_name = request.data.get('shop_name')
        bank_account = request.data.get('bank_account')
        business_address = request.data.get('business_address')
        if not shop_name or not bank_account or not business_address:
            return Response({'error': 'Missing required info'}, status=400)

        # Create or update SellerProfile
        SellerProfile.objects.update_or_create(
            user=request.user,
            defaults={
                'shop_name': shop_name,
                'bank_account': bank_account,
                'business_address': business_address,
                # etc.
            }
        )
        profile.is_seller = True
        profile.save()
        return Response({'message': 'Seller account created!'})
