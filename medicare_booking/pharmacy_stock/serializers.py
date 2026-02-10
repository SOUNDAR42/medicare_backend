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
class SimplifiedPharmacyMedicineSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medicine.medicine_name', read_only=True)
    pharmacy_name = serializers.CharField(source='pharmacy.pharmacy_name', read_only=True)
    manufacturer_name = serializers.CharField(source='manufacturer.manufacturer_name', read_only=True)
    
    # Custom fields for location
    pharmacy_location = serializers.SerializerMethodField()
    pharmacy_pincode = serializers.CharField(source='pharmacy.pincode', read_only=True)

    class Meta:
        model = Pharmacy_Medicine
        fields = [
            'medicine_instance_id',
            'medicine_name',
            'pharmacy_name',
            'manufacturer_name',
            'price',
            'stock_quantity',
            'expiry_date',
            'pharmacy_location',
            'pharmacy_pincode'
        ]

    def get_pharmacy_location(self, obj):
        return f"{obj.pharmacy.street}, {obj.pharmacy.district}"
