from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Appoints
from doctor_associations.models import Doctor_Hospital
import random

class AppointsSerializer(serializers.ModelSerializer):
    hospital_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Appoints
        fields = '__all__'
        read_only_fields = ['token_no', 'appointment_id', 'doctor_instance']

    def create(self, validated_data):
        hospital_id = validated_data.pop('hospital_id')
        
        # Auto-assign doctor
        available_doctors = Doctor_Hospital.objects.filter(
            hospital__hospital_id=hospital_id,
            is_available=True
        )
        
        if not available_doctors.exists():
            raise ValidationError("No doctors available at this hospital.")
            
        # Random assignment to distribute load (simple logic)
        assigned_doctor = random.choice(available_doctors)
        validated_data['doctor_instance'] = assigned_doctor
        
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Include doctor name
        data['doctor_name'] = instance.doctor_instance.doctor.doctor_name
        
        # Remove sensitive/internal fields
        data.pop('urgency_score', None)
        data.pop('patient_contact', None)
        
        return data
