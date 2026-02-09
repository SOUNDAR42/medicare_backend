from django.urls import path
from . import views

urlpatterns = [
    path('', views.manufacturer_list, name='manufacturer_list'),
]
