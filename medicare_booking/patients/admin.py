from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('name', 'mobileno', 'age', 'gender')
    search_fields = ('name', 'mobileno')
