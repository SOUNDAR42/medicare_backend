from django.contrib import admin
from .models import Appoints

@admin.register(Appoints)
class AppointsAdmin(admin.ModelAdmin):
    list_display = ('appointment_id', 'patient_contact', 'doctor_instance', 'appointment_date')
    list_filter = ('appointment_date',)
    search_fields = ('patient_contact__name', 'token_no')
