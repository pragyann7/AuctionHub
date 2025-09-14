from django.urls import path
from .views import RegisterView, ProtectedView, HomeView, CheckAvailabilityView, UserFetchView, LogoutView, \
    EditProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('protected/', ProtectedView.as_view(), name='register'),
    path('users/me/', UserFetchView.as_view(), name='user-fetch'),
    path('home/', HomeView.as_view(), name='home'),
    path("check-availability/", CheckAvailabilityView.as_view(), name="check-availability"),
    path('edit-profile/', EditProfileView.as_view(), name='edit-profile'),
]
