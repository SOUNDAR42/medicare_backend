from django.contrib import admin
from .models import Hospital

@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ('hospital_id','hospital_name', 'district', 'state', 'contact')
    search_fields = ('hospital_name', 'district', 'state')
