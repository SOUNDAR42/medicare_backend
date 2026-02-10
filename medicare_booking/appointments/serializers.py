from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Appoints
from doctor_associations.models import Doctor_Hospital
from patients.serializers import PatientSerializer
from doctor_associations.serializers import DoctorHospitalSerializer
import random

class AppointsSerializer(serializers.ModelSerializer):
    hospital_id = serializers.CharField(write_only=True)
    patient_details = PatientSerializer(source='patient_contact', read_only=True)
    doctor_details = DoctorHospitalSerializer(source='doctor_instance', read_only=True)

    class Meta:
        model = Appoints
        fields = '__all__'
        read_only_fields = ['token_no', 'appointment_id', 'doctor_instance']

    def create(self, validated_data):
        hospital_id = validated_data.pop('hospital_id')
        
        # Auto-assign doctor
        available_doctors = Doctor_Hospital.objects.filter(
            hospital__hospital_id=hospital_id,
            is_available=True,
            is_accepted=True
        )
        
        if not available_doctors.exists():
            raise ValidationError("No doctors available at this hospital.")
            
        # Random assignment to distribute load (simple logic)
        assigned_doctor = random.choice(available_doctors)
        validated_data['doctor_instance'] = assigned_doctor
        
        return super().create(validated_data)
