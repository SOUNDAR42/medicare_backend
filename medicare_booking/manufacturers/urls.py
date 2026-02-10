from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ManufacturerViewSet)

urlpatterns = [
    path('list/', views.manufacturer_list, name='manufacturer_list'),
    path('', include(router.urls)),
]
