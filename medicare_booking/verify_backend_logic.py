
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicare_booking.settings')
django.setup()

from doctors.models import Doctor
from hospitals.models import Hospital
from specializations.models import Specialization
from doctor_associations.models import Doctor_Hospital
from patients.models import Patient
from appointments.models import Appoints
from datetime import date

def verify_logic():
    print("--- Verifying Backend Logic ---")

    # 1. Setup Data
    try:
        doc = Doctor.objects.first()
        hos = Hospital.objects.first()
        spec = Specialization.objects.first()
        pat = Patient.objects.first()
        
        if not all([doc, hos, spec, pat]):
            print("Error: Missing seed data. Please run seed script first.")
            return

        print(f"Using Doctor: {doc.doctor_id}")
        print(f"Using Hospital: {hos.hospital_id}")

        # 2. Test Invitation Flow
        print("\n--- Testing Invitation Flow ---")
        # Ensure no existing association
        Doctor_Hospital.objects.filter(doctor=doc, hospital=hos).delete()
        
        # Create Invitation (Simulating ViewSet logic)
        assoc = Doctor_Hospital.objects.create(
            doctor=doc,
            hospital=hos,
            specialization=spec,
            fees="500",
            working_hours="9-5",
            is_available=True,
            is_accepted=False
        )
        print(f"Invitation Created. Accepted: {assoc.is_accepted}")
        
        # Accept Invitation
        assoc.is_accepted = True
        assoc.save()
        print(f"Invitation Responded. Accepted: {assoc.is_accepted}")
        
        # Toggle Availability
        assoc.is_available = False
        assoc.save()
        print(f"Availability Toggled. Available: {assoc.is_available}")

        # Reset to available for appointment test
        assoc.is_available = True
        assoc.is_accepted = True
        assoc.save()

        # 3. Test Urgency Token Logic
        print("\n--- Testing Urgency Token Logic ---")
        # Clear appointments for today
        Appoints.objects.filter(doctor_instance=assoc, appointment_date=date.today()).delete()

        # Case A: Normal Urgency (Score 50) -> Should be T1
        app1 = Appoints.objects.create(
            doctor_instance=assoc,
            patient_contact=pat,
            appointment_date=date.today(),
            urgency_score=50
        )
        print(f"Appt 1 (Score 50): Token {app1.token_no}")
        
        # Case B: High Urgency (Score 90) -> Should be U1
        app2 = Appoints.objects.create(
            doctor_instance=assoc,
            patient_contact=pat,
            appointment_date=date.today(),
            urgency_score=90
        )
        print(f"Appt 2 (Score 90): Token {app2.token_no}")

        # Case C: Normal Urgency again -> Should be T2
        app3 = Appoints.objects.create(
            doctor_instance=assoc,
            patient_contact=pat,
            appointment_date=date.today(),
            urgency_score=60
        )
        print(f"Appt 3 (Score 60): Token {app3.token_no}")

        # Case D: High Urgency again -> Should be U2
        app4 = Appoints.objects.create(
            doctor_instance=assoc,
            patient_contact=pat,
            appointment_date=date.today(),
            urgency_score=85
        )
        print(f"Appt 4 (Score 85): Token {app4.token_no}")
        
        if app1.token_no == 'T1' and app2.token_no == 'U1' and app3.token_no == 'T2' and app4.token_no == 'U2':
            print("\nSUCCESS: Token Pattern Verified (T1, U1, T2, U2)")
        else:
            print("\nFAILURE: Token Pattern Incorrect")

    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    verify_logic()
