import os
from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from drawsocket.consumers import EchoConsumer
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
from channels.auth import AuthMiddlewareStack
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            [
                re_path("draw/(?P<nickname>\w+)", EchoConsumer.as_asgi()),
            ]
        )
    ),
})