import os

import django
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import auctions.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auctionhub.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            auctions.routing.websocket_urlpatterns
        )
    ),
})

