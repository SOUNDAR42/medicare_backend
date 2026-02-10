from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.PharmacyViewSet)

urlpatterns = [
    path('list/', views.pharmacy_list, name='pharmacy_list'),
    path('api/search/', views.PharmacySearchAPIView.as_view(), name='pharmacy_search_api'),
    path('', include(router.urls)),
]
