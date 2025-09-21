from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import Profile, SellerProfile
from .serializers import RegisterSerializer, UserProfileSerializer
from django.contrib.auth.models import User
from django.db.models import Count
from django.contrib.auth import get_user_model
from .utils import send_email_otp
from .models import EmailOTP
from django.utils import timezone

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")

        if not email or not username or not password:
            return Response({"error": "Username, email and password are required"}, status=400)

        # Check if user already exists
        existing_user = User.objects.filter(email=email).first()
        if existing_user:
            # If unverified, update credentials and resend OTP
            if hasattr(existing_user, 'profile') and not existing_user.profile.email_verified:
                existing_user.username = username
                existing_user.set_password(password)
                existing_user.save()
                send_email_otp(existing_user)
                return Response({
                    "message": "You already signed up but didn't verify your email. Your credentials were updated and OTP resent."
                }, status=200)
            else:
                return Response({"email": "Email already exists"}, status=400)

        # Create new user
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_email_otp(user)
            return Response({
                'message': 'User registered successfully! We sent a verification code to your email.'
            }, status=201)

        return Response(serializer.errors, status=400)


class VerifyEmailOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')

        if not email or not code:
            return Response({'error': 'Email and code required'}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        try:
            otp_obj = EmailOTP.objects.get(user=user, code=code)
        except EmailOTP.DoesNotExist:
            return Response({'error': 'Invalid code'}, status=400)

        if otp_obj.is_expired():
            return Response({'error': 'Code expired'}, status=400)

        if hasattr(user, 'profile'):
            user.profile.email_verified = True
            user.profile.save()
        else:
            user.email_verified = True
            user.save()

        otp_obj.delete()

        return Response({'message': 'Email verified successfully'})
    
    
class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(user, 'profile') and user.profile.email_verified:
            return Response({"message": "Email is already verified."}, status=status.HTTP_400_BAD_REQUEST)

        last_otp = EmailOTP.objects.filter(user=user).order_by('-created_at').first()
        cooldown_seconds = 60
        if last_otp and (timezone.now() - last_otp.created_at).total_seconds() < cooldown_seconds:
            remaining = cooldown_seconds - int((timezone.now() - last_otp.created_at).total_seconds())
            return Response(
                {"error": f"Please wait before requesting a new OTP.", "remaining_seconds": remaining},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        send_email_otp(user)
        return Response({"message": "A new OTP has been sent to your email."}, status=status.HTTP_200_OK)



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



class PublicUserDetailAPIView(generics.RetrieveAPIView):

    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        return User.objects.annotate(
            total_products=Count('products')
        )

    
class CheckAvailabilityView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")

        errors = {}

        if username:
            verified_users = User.objects.filter(profile__email_verified=True)
            if verified_users.filter(username=username).exists():
                errors["username"] = "Username already exists"

        if email:
            verified_users = User.objects.filter(profile__email_verified=True)
            if verified_users.filter(email=email).exists():
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
            }
        )
        profile.is_seller = True
        profile.save()
        return Response({'message': 'Seller account created!'})
