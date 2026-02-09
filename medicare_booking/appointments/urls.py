from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointsViewSet

router = DefaultRouter()
router.register(r'', AppointsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
