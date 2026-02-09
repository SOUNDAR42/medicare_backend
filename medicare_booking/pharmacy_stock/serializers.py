from rest_framework import serializers
from .models import Pharmacy_Medicine
from pharmacies.serializers import PharmacySerializer
from medicines.serializers import MedicineSerializer
from manufacturers.serializers import ManufacturerSerializer

class PharmacyMedicineSerializer(serializers.ModelSerializer):
    pharmacy_details = PharmacySerializer(source='pharmacy', read_only=True)
    medicine_details = MedicineSerializer(source='medicine', read_only=True)
    manufacturer_details = ManufacturerSerializer(source='manufacturer', read_only=True)

    class Meta:
        model = Pharmacy_Medicine
        fields = '__all__'
        read_only_fields = ['medicine_instance_id']
