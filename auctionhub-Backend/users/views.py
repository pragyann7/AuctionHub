from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .serializers import RegisterSerializer
from django.contrib.auth.models import User


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Hello, {request.user.username}! Welcome"})


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
            pass  # token already invalid/blacklisted

        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    

class UserFetchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"username": user.username})

class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Welcome {request.user.username}!",
                         "username": request.user.username})
    
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