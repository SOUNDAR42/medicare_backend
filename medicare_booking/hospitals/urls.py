from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.HospitalViewSet)

urlpatterns = [
    path('search/', views.hospital_search, name='hospital_search'),
    path('api/search/', views.HospitalSearchAPIView.as_view(), name='hospital_search_api'),
    path('', include(router.urls)),
]
