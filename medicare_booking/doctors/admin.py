from django.contrib import admin
from .models import Doctor

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('doctor_name', 'experience', 'doctor_id', 'password')
    search_fields = ('doctor_name',)
