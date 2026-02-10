from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from doctors.models import Doctor
from hospitals.models import Hospital
from pharmacies.models import Pharmacy
from doctors.serializers import DoctorSerializer
from hospitals.serializers import HospitalSerializer
from pharmacies.serializers import PharmacySerializer

@api_view(['POST'])
def login_doctor(request):
    doctor_id = request.data.get('doctor_id')
    password = request.data.get('password')
    
    try:
        doctor = Doctor.objects.get(doctor_id=doctor_id)
        if doctor.password == password:
            return Response({
                'status': 'success',
                'role': 'doctor',
                'data': DoctorSerializer(doctor).data
            })
        else:
            return Response({'status': 'error', 'message': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
    except Doctor.DoesNotExist:
        return Response({'status': 'error', 'message': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def login_hospital(request):
    hospital_id = request.data.get('hospital_id')
    password = request.data.get('password')
    
    try:
        hospital = Hospital.objects.get(hospital_id=hospital_id)
        if hospital.password == password:
            return Response({
                'status': 'success',
                'role': 'hospital',
                'data': HospitalSerializer(hospital).data
            })
        else:
            return Response({'status': 'error', 'message': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
    except Hospital.DoesNotExist:
        return Response({'status': 'error', 'message': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def login_pharmacy(request):
    pharmacy_id = request.data.get('pharmacy_id')
    password = request.data.get('password')
    
    try:
        pharmacy = Pharmacy.objects.get(pharmacy_id=pharmacy_id)
        if pharmacy.password == password:
            return Response({
                'status': 'success',
                'role': 'pharmacy',
                'data': PharmacySerializer(pharmacy).data
            })
        else:
            return Response({'status': 'error', 'message': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
    except Pharmacy.DoesNotExist:
        return Response({'status': 'error', 'message': 'Pharmacy not found'}, status=status.HTTP_404_NOT_FOUND)
