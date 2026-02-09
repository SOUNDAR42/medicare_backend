from django.contrib import admin
from .models import Doctor_Hospital

@admin.register(Doctor_Hospital)
class DoctorHospitalAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'hospital', 'specialization', 'fees', 'is_available')
    list_filter = ('hospital', 'specialization', 'is_available')
