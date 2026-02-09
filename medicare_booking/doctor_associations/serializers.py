from rest_framework import serializers
from .models import Doctor_Hospital

class DoctorHospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor_Hospital
        fields = '__all__'
