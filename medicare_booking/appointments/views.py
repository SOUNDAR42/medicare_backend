from rest_framework import viewsets
from .models import Appoints
from .serializers import AppointsSerializer

class AppointsViewSet(viewsets.ModelViewSet):
    queryset = Appoints.objects.all()
    serializer_class = AppointsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by patient
        mobile_no = self.request.query_params.get('patient_mobile')
        if mobile_no:
            queryset = queryset.filter(patient_contact__mobileno=mobile_no)
            
        # Filter by doctor (for Doctor Dashboard)
        doctor_id = self.request.query_params.get('doctor_id')
        if doctor_id:
            queryset = queryset.filter(doctor_instance__doctor__doctor_id=doctor_id)

        # Filter by hospital (for Hospital Dashboard)
        hospital_id = self.request.query_params.get('hospital_id')
        if hospital_id:
            queryset = queryset.filter(doctor_instance__hospital__hospital_id=hospital_id)
            
        # Filter by Date
        appointment_date = self.request.query_params.get('appointment_date')
        if appointment_date:
            queryset = queryset.filter(appointment_date=appointment_date)
            
        # Sorting
        # Primary: Urgency Score (Desc)
        # Secondary: Token No (Asc) - Note: String sorting might be imperfect for T1 vs T10 but acceptable for now
        queryset = queryset.order_by('-urgency_score', 'token_no')
        
        return queryset

from rest_framework import status, views
from rest_framework.response import Response
from django.db.models import Count, Q
from doctor_associations.models import Doctor_Hospital
from patients.models import Patient
import datetime

class BookHospitalAppointmentView(views.APIView):
    def post(self, request):
        hospital_id = request.data.get('hospital_id')
        patient_mobile = request.data.get('patient_mobile')
        appointment_date = request.data.get('appointment_date')
        urgency_score = request.data.get('urgency_score', 1)

        if not all([hospital_id, patient_mobile, appointment_date]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            patient = Patient.objects.get(mobileno=patient_mobile)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

        # Find doctors in this hospital who are accepted and available
        doctors = Doctor_Hospital.objects.filter(
            hospital__hospital_id=hospital_id, 
            is_accepted=True, 
            is_available=True
        )

        if not doctors.exists():
            return Response({'error': 'No available doctors in this hospital'}, status=status.HTTP_400_BAD_REQUEST)

        # Load Balancing: Find doctor with minimum appointments on that date
        # We annotate each doctor with the count of appointments for the given date
        # Note: We need to filter appointments by date first. 
        # Since we can't easily filter inside Count in simple Django without conditional expressions (which is fine),
        # an alternative is to iterate if list is small, or use Count with filter.
        
        # Using annotation with filtering is cleaner:
        doctors = doctors.annotate(
            appt_count=Count('appoints', filter=Q(appoints__appointment_date=appointment_date))
        ).order_by('appt_count')

        # Pick the one with least appointments
        selected_doctor = doctors.first()

        # Create Appointment
        appointment = Appoints.objects.create(
            doctor_instance=selected_doctor,
            patient_contact=patient,
            appointment_date=appointment_date,
            urgency_score=urgency_score,
            appointment_status='Pending'
        )

        serializer = AppointsSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class HospitalAppointmentListView(views.APIView):
    def get(self, request, hospital_id):
        # List all appointments for a given hospital
        appointments = Appoints.objects.filter(
            doctor_instance__hospital__hospital_id=hospital_id
        ).order_by('-appointment_date', 'token_no')
        
        serializer = AppointsSerializer(appointments, many=True)
        return Response(serializer.data)
