from django.urls import path
from .views import RegisterView, CheckAvailabilityView, UserFetchView, LogoutView, \
    EditProfileView, BecomeSellerView, PublicUserDetailAPIView,VerifyEmailOTPView, ResendOTPView, PasswordResetRequestView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.tokens import MyTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    # path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('users/me/', UserFetchView.as_view(), name='user-fetch'),
    path('users/<int:pk>/', PublicUserDetailAPIView.as_view(), name='user-detail'),
    path("check-availability/", CheckAvailabilityView.as_view(), name="check-availability"),
    path('edit-profile/', EditProfileView.as_view(), name='edit-profile'),
    path('become-seller/', BecomeSellerView.as_view(), name='become-seller'),
    path('verify-email/', VerifyEmailOTPView.as_view(), name='verify-email'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

]
