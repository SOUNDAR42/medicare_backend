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
from hospitals import views as hospitals_views
from medicines import views as medicines_views
from pharmacies import views as pharmacies_views
from pharmacy_stock import views as stock_views

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth
    path('api/v1/login/doctor/', auth_views.login_doctor, name='login_doctor'),
    path('api/v1/login/hospital/', auth_views.login_hospital, name='login_hospital'),
    path('api/v1/login/pharmacy/', auth_views.login_pharmacy, name='login_pharmacy'),
    
    # Static HTML Pages
    path('hospitals-list/', hospitals_views.hospital_list, name='page_hospital_list'),
    path('medicines-list/', medicines_views.medicine_list, name='page_medicine_list'),
    path('pharmacies-list/', pharmacies_views.pharmacy_list, name='page_pharmacy_list'),
    path('stock-list/', stock_views.stock_list, name='page_stock_list'),

    # App endpoints
    path('api/v1/patients/', include('patients.urls')),
    path('api/v1/hospitals/', include('hospitals.urls')),
    path('api/v1/doctors/', include('doctors.urls')),
    path('api/v1/specializations/', include('specializations.urls')),
    path('api/v1/associations/', include('doctor_associations.urls')),
    path('api/v1/appointments/', include('appointments.urls')),
    path('api/v1/pharmacies/', include('pharmacies.urls')),
    path('api/v1/medicines/', include('medicines.urls')),
    path('api/v1/pharmacy-stock/', include('pharmacy_stock.urls')),
    path('api/v1/manufacturers/', include('manufacturers.urls')),
]
