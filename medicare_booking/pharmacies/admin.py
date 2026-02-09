from django.contrib import admin
from .models import Pharmacy

@admin.register(Pharmacy)
class PharmacyAdmin(admin.ModelAdmin):
    list_display = ('pharmacy_name', 'pincode', 'contact')
    search_fields = ('pharmacy_name', 'pincode')
