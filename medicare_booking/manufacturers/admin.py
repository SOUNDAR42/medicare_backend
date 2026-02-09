from django.contrib import admin
from .models import Manufacturer

@admin.register(Manufacturer)
class ManufacturerAdmin(admin.ModelAdmin):
    list_display = ('manufacturer_id', 'manufacturer_name')
    search_fields = ('manufacturer_name',)
