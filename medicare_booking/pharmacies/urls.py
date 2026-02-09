from django.urls import path
from . import views

urlpatterns = [
    path('', views.pharmacy_list, name='pharmacy_list'),
    path('api/search/', views.PharmacySearchAPIView.as_view(), name='pharmacy_search_api'),
]
