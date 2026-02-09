from django.contrib import admin
from .models import Medicine

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('medicine_id', 'medicine_name', 'dosage_form')
    search_fields = ('medicine_name',)
