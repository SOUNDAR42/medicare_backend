from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.MedicineViewSet)

urlpatterns = [
    path('list/', views.medicine_list, name='medicine_list'),
    path('', include(router.urls)),
]
