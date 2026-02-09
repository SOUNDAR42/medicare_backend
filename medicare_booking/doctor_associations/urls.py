from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorHospitalViewSet

router = DefaultRouter()
router.register(r'', DoctorHospitalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
