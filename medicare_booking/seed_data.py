import os
import django
import random
from datetime import date
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicare_booking.settings')
django.setup()

from doctors.models import Doctor
from hospitals.models import Hospital
from patients.models import Patient
from appointments.models import Appoints
from doctor_associations.models import Doctor_Hospital
from specializations.models import Specialization

def seed():
    print("Seeding data...")

    # 1. Create Specialization
    spec, created = Specialization.objects.get_or_create(
        specialization_name="General Medicine",
        defaults={'description': 'General health issues'}
    )

    # 2. Create Doctor
    doc, created = Doctor.objects.get_or_create(
        doctor_name="Dr. Smith",
        defaults={'experience': 10, 'password': 'password'}
    )
    print(f"Doctor: {doc.doctor_name} ({doc.doctor_id})")

    # 3. Create Hospital
    hosp, created = Hospital.objects.get_or_create(
        hospital_name="City General Hospital",
        defaults={
            'street': '123 Main St',
            'district': 'Central',
            'state': 'Stateville',
            'pincode': 123456,
            'contact': '9876543210',
            'working_hours': '9AM - 5PM'
        }
    )
    print(f"Hospital: {hosp.hospital_name} ({hosp.hospital_id})")

    # 4. Create Doctor_Hospital Association
    doc_hosp, created = Doctor_Hospital.objects.get_or_create(
        doctor=doc,
        hospital=hosp,
        specialization=spec,
        defaults={
            'fees': '500',
            'working_hours': '9AM - 5PM',
            'is_accepted': True
        }
    )

    # 5. Create Patients and Appointments
    patients_data = [
        {'name': 'Alice Johnson', 'age': 30, 'gender': 'Female', 'mobile': '9000000001', 'pin': 100001, 'urgent': True},
        {'name': 'Bob Williams', 'age': 45, 'gender': 'Male', 'mobile': '9000000002', 'pin': 100002, 'urgent': True},
        {'name': 'Charlie Brown', 'age': 25, 'gender': 'Male', 'mobile': '9000000003', 'pin': 100003, 'urgent': False},
        {'name': 'Diana Prince', 'age': 28, 'gender': 'Female', 'mobile': '9000000004', 'pin': 100004, 'urgent': False},
        {'name': 'Evan Wright', 'age': 35, 'gender': 'Male', 'mobile': '9000000005', 'pin': 100005, 'urgent': False},
    ]

    for p_data in patients_data:
        # Create Patient
        patient, created = Patient.objects.get_or_create(
            mobileno=p_data['mobile'],
            defaults={
                'name': p_data['name'],
                'age': p_data['age'],
                'gender': p_data['gender'],
                'pincode': p_data['pin']
            }
        )
        
        # Determine Urgency Score
        # Urgent > 80, Not Urgent <= 80 (default is 1)
        urgency = 90 if p_data['urgent'] else 10

        # Create Appointment
        appt = Appoints.objects.create(
            doctor_instance=doc_hosp,
            patient_contact=patient,
            appointment_date=date.today(),
            urgency_score=urgency,
            appointment_status='Pending'
        )
        status = "URGENT" if p_data['urgent'] else "NORMAL"
        print(f"Created Appointment for {patient.name}: {status} (Score: {urgency}) - ID: {appt.appointment_id}")

    print("Seeding completed successfully.")

if __name__ == '__main__':
    seed()
