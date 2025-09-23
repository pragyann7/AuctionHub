"""
ASGI config for auctionhub project.

It exposes the ASGI callable as a module-level variable named ``application``.
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()  # make sure .env is at project root (same level as manage.py)

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auctionhub.settings')

# Import your websocket routing
import auctions.routing  # assuming you have auctions/routing.py

# Standard Django ASGI application
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,  # for standard HTTP requests
    "websocket": AuthMiddlewareStack(
        URLRouter(
            auctions.routing.websocket_urlpatterns
        )
    ),
})