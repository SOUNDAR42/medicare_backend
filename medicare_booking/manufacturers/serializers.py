from rest_framework import serializers
from .models import Manufacturer

class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = '__all__'
        read_only_fields = ['manufacturer_id']
