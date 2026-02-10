from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Doctor_Hospital
from .serializers import DoctorHospitalSerializer
from doctors.models import Doctor
from hospitals.models import Hospital
from specializations.models import Specialization

class DoctorHospitalViewSet(viewsets.ModelViewSet):
    queryset = Doctor_Hospital.objects.all()
    serializer_class = DoctorHospitalSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by Specialization
        spec_id = self.request.query_params.get('specialization_id')
        if spec_id:
            queryset = queryset.filter(specialization__specialization_id=spec_id)
            
        # Filter by Doctor (for Doctor Dashboard)
        doctor_id = self.request.query_params.get('doctor_id')
        if doctor_id:
            queryset = queryset.filter(doctor__doctor_id=doctor_id)
            
        # Filter by Hospital (for Hospital Dashboard)
        hospital_id = self.request.query_params.get('hospital_id')
        if hospital_id:
            queryset = queryset.filter(hospital__hospital_id=hospital_id)

        return queryset

    @action(detail=False, methods=['post'])
    def invite_doctor(self, request):
        hospital_id = request.data.get('hospital_id')
        doctor_identifier = request.data.get('doctor_identifier') # ID or Phone
        specialization_id = request.data.get('specialization_id')
        fees = request.data.get('fees')
        working_hours = request.data.get('working_hours')

        if not all([hospital_id, doctor_identifier, specialization_id, fees, working_hours]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            hospital = Hospital.objects.get(hospital_id=hospital_id)
            specialization = Specialization.objects.get(specialization_id=specialization_id)
            
            # Find doctor by ID or Phone
            doctor = Doctor.objects.filter(doctor_id=doctor_identifier).first()
            if not doctor:
                doctor = Doctor.objects.filter(mobileno=doctor_identifier).first() # Assuming mobileno exists on Doctor
            
            if not doctor:
                 return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

            # Check if association already exists
            if Doctor_Hospital.objects.filter(doctor=doctor, hospital=hospital).exists():
                return Response({'error': 'Doctor already associated with this hospital'}, status=status.HTTP_400_BAD_REQUEST)

            association = Doctor_Hospital.objects.create(
                doctor=doctor,
                hospital=hospital,
                specialization=specialization,
                fees=fees,
                working_hours=working_hours,
                is_available=True,
                is_accepted=False # Invitation is pending
            )
            
            return Response(DoctorHospitalSerializer(association).data, status=status.HTTP_201_CREATED)

        except (Hospital.DoesNotExist, Specialization.DoesNotExist):
            return Response({'error': 'Hospital or Specialization not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def respond_invite(self, request, pk=None):
        association = self.get_object()
        action_val = request.data.get('status') # 'accept' or 'reject'
        
        if action_val == 'accept':
            association.is_accepted = True
            association.save()
            return Response({'status': 'accepted'})
        elif action_val == 'reject':
            association.delete()
            return Response({'status': 'rejected'})
        else:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def toggle_availability(self, request, pk=None):
        association = self.get_object()
        association.is_available = not association.is_available
        association.save()
        return Response({'status': 'updated', 'is_available': association.is_available})
