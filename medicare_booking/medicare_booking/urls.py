"""
URL configuration for medicare_booking project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/doctor/', auth_views.login_doctor, name='login_doctor'),
    path('api/login/hospital/', auth_views.login_hospital, name='login_hospital'),
    path('api/login/pharmacy/', auth_views.login_pharmacy, name='login_pharmacy'),
    path('api/patients/', include('patients.urls')),
    path('hospitals/', include('hospitals.urls')),
    path('api/doctors/', include('doctors.urls')),
    path('api/specializations/', include('specializations.urls')),
    path('api/associations/', include('doctor_associations.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('pharmacies/', include('pharmacies.urls')),
    path('medicines/', include('medicines.urls')),
    path('pharmacy-stock/', include('pharmacy_stock.urls')),
    path('manufacturers/', include('manufacturers.urls')),
]
