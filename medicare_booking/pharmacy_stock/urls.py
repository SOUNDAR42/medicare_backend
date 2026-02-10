from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.PharmacyStockViewSet)

urlpatterns = [
    path('list/', views.stock_list, name='stock_list'),
    path('medicine/<int:pincode>/', views.MedicineAvailabilityAPIView.as_view(), name='medicine_availability'),
    path('', include(router.urls)),
]
