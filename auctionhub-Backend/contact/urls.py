from django.urls import path
from .views import ContactMessageCreateView

urlpatterns = [
    path("submit/", ContactMessageCreateView.as_view(), name="contact-submit"),
]
