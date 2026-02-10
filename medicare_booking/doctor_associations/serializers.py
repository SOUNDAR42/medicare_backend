from rest_framework import serializers
from .models import Doctor_Hospital
from doctors.serializers import DoctorSerializer
from hospitals.serializers import HospitalSerializer
from specializations.serializers import SpecializationSerializer

class DoctorHospitalSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.doctor_name', read_only=True)
    hospital_name = serializers.CharField(source='hospital.hospital_name', read_only=True)
    specialization_name = serializers.CharField(source='specialization.specialization_name', read_only=True)
    
    class Meta:
        model = Doctor_Hospital
        fields = ['doctor_instance_id', 'doctor', 'hospital', 'specialization', 'doctor_name', 'hospital_name', 'specialization_name', 'fees', 'working_hours', 'is_available', 'is_accepted']
        read_only_fields = ['doctor_instance_id', 'doctor_name', 'hospital_name', 'specialization_name']
