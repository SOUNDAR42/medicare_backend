from django.contrib import admin
from .models import Pharmacy_Medicine

@admin.register(Pharmacy_Medicine)
class PharmacyMedicineAdmin(admin.ModelAdmin):
    list_display = ('pharmacy', 'medicine', 'manufacturer', 'price', 'stock_quantity', 'expiry_date', 'is_available')
    list_filter = ('pharmacy', 'manufacturer', 'is_available', 'expiry_date')
    search_fields = ('pharmacy__pharmacy_name', 'medicine__medicine_name', 'manufacturer__manufacturer_name')
