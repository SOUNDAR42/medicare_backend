import os
import django
import random
from datetime import date, timedelta
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicare_booking.settings')
django.setup()

from doctors.models import Doctor
from hospitals.models import Hospital
from patients.models import Patient
from appointments.models import Appoints
from doctor_associations.models import Doctor_Hospital
from specializations.models import Specialization
from medicines.models import Medicine
from manufacturers.models import Manufacturer
from pharmacies.models import Pharmacy
from pharmacy_stock.models import Pharmacy_Medicine


def seed():
    print("=" * 60)
    print("  MediCare Booking - Comprehensive Data Seeder")
    print("=" * 60)

    # ─── 1. SPECIALIZATIONS ───────────────────────────────────
    specialization_names = [
        "General Medicine",
        "Cardiology",
        "Orthopedics",
        "Pediatrics",
        "Dermatology",
        "Neurology",
        "Gynecology",
        "Ophthalmology",
        "ENT (Ear, Nose, Throat)",
        "Psychiatry",
    ]
    specializations = []
    for name in specialization_names:
        spec, created = Specialization.objects.get_or_create(specialization_name=name)
        specializations.append(spec)
        status = "✓ Created" if created else "• Exists"
        print(f"  {status}: Specialization - {name}")

    print(f"\n  Total Specializations: {len(specializations)}\n")

    # ─── 2. DOCTORS ───────────────────────────────────────────
    doctors_data = [
        {"name": "Dr. Rajesh Sharma", "experience": 15},
        {"name": "Dr. Priya Kapoor", "experience": 12},
        {"name": "Dr. Amit Verma", "experience": 8},
        {"name": "Dr. Sneha Iyer", "experience": 20},
        {"name": "Dr. Vikram Malhotra", "experience": 6},
        {"name": "Dr. Ananya Das", "experience": 10},
        {"name": "Dr. Rohan Mehta", "experience": 18},
        {"name": "Dr. Kavita Singh", "experience": 14},
        {"name": "Dr. Sanjay Gupta", "experience": 25},
        {"name": "Dr. Meera Nair", "experience": 9},
    ]
    doctors = []
    for d in doctors_data:
        doc, created = Doctor.objects.get_or_create(
            doctor_name=d["name"],
            defaults={"experience": d["experience"], "password": "password123"}
        )
        doctors.append(doc)
        status = "✓ Created" if created else "• Exists"
        print(f"  {status}: Doctor - {doc.doctor_name} (ID: {doc.doctor_id}, Exp: {d['experience']} yrs)")

    print(f"\n  Total Doctors: {len(doctors)}\n")

    # ─── 3. HOSPITALS ─────────────────────────────────────────
    hospitals_data = [
        {"name": "Apollo Hospitals",       "street": "21 Greams Lane",          "district": "Chennai Central",  "state": "Tamil Nadu",    "pincode": 600006, "contact": "9876543210", "hours": "24/7"},
        {"name": "Fortis Healthcare",      "street": "B-22, Sector 62",        "district": "Noida",            "state": "Uttar Pradesh", "pincode": 201301, "contact": "9876543211", "hours": "8AM - 10PM"},
        {"name": "Max Super Specialty",    "street": "1, Press Enclave Road",  "district": "Saket",            "state": "Delhi",         "pincode": 110017, "contact": "9876543212", "hours": "24/7"},
        {"name": "AIIMS Delhi",            "street": "Sri Aurobindo Marg",     "district": "New Delhi",        "state": "Delhi",         "pincode": 110029, "contact": "9876543213", "hours": "24/7"},
        {"name": "Medanta The Medicity",   "street": "CH Baktawar Singh Road", "district": "Gurgaon",          "state": "Haryana",       "pincode": 122001, "contact": "9876543214", "hours": "24/7"},
        {"name": "Narayana Health",        "street": "258/A, Bommasandra",     "district": "Bangalore South",  "state": "Karnataka",     "pincode": 560099, "contact": "9876543215", "hours": "8AM - 9PM"},
        {"name": "Manipal Hospitals",      "street": "98 HAL Airport Road",    "district": "Bangalore East",   "state": "Karnataka",     "pincode": 560017, "contact": "9876543216", "hours": "24/7"},
        {"name": "Kokilaben Hospital",     "street": "Rao Saheb Achutrao Patwardhan Marg", "district": "Mumbai West", "state": "Maharashtra", "pincode": 400053, "contact": "9876543217", "hours": "24/7"},
    ]
    hospitals = []
    for h in hospitals_data:
        hosp, created = Hospital.objects.get_or_create(
            hospital_name=h["name"],
            defaults={
                "street": h["street"],
                "district": h["district"],
                "state": h["state"],
                "pincode": h["pincode"],
                "contact": h["contact"],
                "working_hours": h["hours"],
                "password": "password123"
            }
        )
        hospitals.append(hosp)
        status = "✓ Created" if created else "• Exists"
        print(f"  {status}: Hospital - {hosp.hospital_name} ({hosp.hospital_id})")

    print(f"\n  Total Hospitals: {len(hospitals)}\n")

    # ─── 4. PATIENTS ──────────────────────────────────────────
    patients_data = [
        {"name": "Aarav Patel",      "age": 28, "gender": "Male",   "mobile": "9100000001", "pin": 600006},
        {"name": "Diya Sharma",      "age": 34, "gender": "Female", "mobile": "9100000002", "pin": 201301},
        {"name": "Vihaan Reddy",     "age": 45, "gender": "Male",   "mobile": "9100000003", "pin": 110017},
        {"name": "Anaya Joshi",      "age": 22, "gender": "Female", "mobile": "9100000004", "pin": 110029},
        {"name": "Arjun Nair",       "age": 55, "gender": "Male",   "mobile": "9100000005", "pin": 122001},
        {"name": "Isha Gupta",       "age": 30, "gender": "Female", "mobile": "9100000006", "pin": 560099},
        {"name": "Kabir Malhotra",   "age": 40, "gender": "Male",   "mobile": "9100000007", "pin": 560017},
        {"name": "Mira Desai",       "age": 27, "gender": "Female", "mobile": "9100000008", "pin": 400053},
        {"name": "Reyansh Kumar",    "age": 60, "gender": "Male",   "mobile": "9100000009", "pin": 600006},
        {"name": "Saanvi Mehta",     "age": 19, "gender": "Female", "mobile": "9100000010", "pin": 201301},
        {"name": "Dhruv Bhatt",      "age": 38, "gender": "Male",   "mobile": "9100000011", "pin": 110017},
        {"name": "Kiara Saxena",     "age": 50, "gender": "Female", "mobile": "9100000012", "pin": 110029},
        {"name": "Advait Rao",       "age": 33, "gender": "Male",   "mobile": "9100000013", "pin": 122001},
        {"name": "Navya Kulkarni",   "age": 26, "gender": "Female", "mobile": "9100000014", "pin": 560099},
        {"name": "Ishaan Verma",     "age": 42, "gender": "Male",   "mobile": "9100000015", "pin": 560017},
        {"name": "Anika Bose",       "age": 31, "gender": "Female", "mobile": "9100000016", "pin": 400053},
        {"name": "Vivaan Tiwari",    "age": 48, "gender": "Male",   "mobile": "9100000017", "pin": 600006},
        {"name": "Riya Chatterjee",  "age": 36, "gender": "Female", "mobile": "9100000018", "pin": 201301},
        {"name": "Aditya Pandey",    "age": 29, "gender": "Male",   "mobile": "9100000019", "pin": 110017},
        {"name": "Prisha Menon",     "age": 24, "gender": "Female", "mobile": "9100000020", "pin": 122001},
    ]
    patients = []
    for p in patients_data:
        patient, created = Patient.objects.get_or_create(
            mobileno=p["mobile"],
            defaults={
                "name": p["name"],
                "age": p["age"],
                "gender": p["gender"],
                "pincode": p["pin"]
            }
        )
        patients.append(patient)
        status = "✓ Created" if created else "• Exists"
        print(f"  {status}: Patient - {patient.name} (Mobile: {patient.mobileno})")

    print(f"\n  Total Patients: {len(patients)}\n")

    # ─── 5. DOCTOR-HOSPITAL ASSOCIATIONS ──────────────────────
    assoc_data = [
        # (doctor_idx, hospital_idx, spec_idx, fees, hours)
        (0, 0, 0, "500", "9AM - 5PM"),    # Dr. Rajesh @ Apollo - General
        (0, 1, 0, "600", "10AM - 6PM"),   # Dr. Rajesh @ Fortis - General
        (1, 0, 1, "800", "9AM - 3PM"),    # Dr. Priya @ Apollo - Cardiology
        (2, 2, 2, "700", "10AM - 4PM"),   # Dr. Amit @ Max - Orthopedics
        (3, 3, 3, "400", "8AM - 2PM"),    # Dr. Sneha @ AIIMS - Pediatrics
        (4, 4, 4, "550", "11AM - 7PM"),   # Dr. Vikram @ Medanta - Dermatology
        (5, 5, 5, "900", "9AM - 1PM"),    # Dr. Ananya @ Narayana - Neurology
        (6, 6, 6, "650", "10AM - 6PM"),   # Dr. Rohan @ Manipal - Gynecology
        (7, 7, 7, "500", "9AM - 5PM"),    # Dr. Kavita @ Kokilaben - Ophthalmology
        (8, 3, 0, "300", "8AM - 12PM"),   # Dr. Sanjay @ AIIMS - General
        (9, 5, 8, "450", "2PM - 8PM"),    # Dr. Meera @ Narayana - ENT
        (1, 4, 1, "850", "9AM - 2PM"),    # Dr. Priya @ Medanta - Cardiology
        (3, 6, 3, "500", "1PM - 5PM"),    # Dr. Sneha @ Manipal - Pediatrics
        (5, 2, 5, "950", "8AM - 12PM"),   # Dr. Ananya @ Max - Neurology
    ]
    associations = []
    for di, hi, si, fees, hours in assoc_data:
        assoc, created = Doctor_Hospital.objects.get_or_create(
            doctor=doctors[di],
            hospital=hospitals[hi],
            specialization=specializations[si],
            defaults={
                "fees": fees,
                "working_hours": hours,
                "is_accepted": True,
                "is_available": random.choice([True, True, True, False])  # 75% available
            }
        )
        associations.append(assoc)
        status = "✓ Created" if created else "• Exists"
        print(f"  {status}: {doctors[di].doctor_name} @ {hospitals[hi].hospital_name} ({specializations[si].specialization_name}) - ₹{fees}")

    print(f"\n  Total Associations: {len(associations)}\n")

    # ─── 6. APPOINTMENTS ──────────────────────────────────────
    today = date.today()
    appt_configs = [
        # (patient_idx, assoc_idx, days_offset, urgency, status)
        (0,  0,  0, 90, "Pending"),
        (1,  0,  0, 10, "Pending"),
        (2,  2,  0, 85, "Pending"),
        (3,  3,  0, 20, "Consulting"),
        (4,  4,  0, 15, "Pending"),
        (5,  5,  0, 92, "Pending"),
        (6,  6,  0, 30, "Completed"),
        (7,  7,  0, 88, "Pending"),
        (8,  9,  0, 10, "Pending"),
        (9,  10, 0, 50, "Consulting"),
        (10, 1,  0, 95, "Pending"),
        (11, 3,  0, 25, "Pending"),
        (12, 4, -1, 40, "Completed"),
        (13, 5, -1, 80, "Completed"),
        (14, 6, -1, 10, "Completed"),
        (15, 7, -2, 60, "Cancelled"),
        (16, 0,  1, 30, "Pending"),
        (17, 2,  1, 75, "Pending"),
        (18, 3,  1, 15, "Pending"),
        (19, 5,  1, 88, "Pending"),
    ]
    appointments = []
    for pi, ai, offset, urgency, status in appt_configs:
        appt_date = today + timedelta(days=offset)
        appt = Appoints.objects.create(
            doctor_instance=associations[ai],
            patient_contact=patients[pi],
            appointment_date=appt_date,
            urgency_score=urgency,
            appointment_status=status
        )
        appointments.append(appt)
        label = "🔴 URGENT" if urgency > 80 else "🟢 NORMAL"
        print(f"  ✓ Appointment: {patients[pi].name} → {associations[ai]} | {appt_date} | {label} (Score: {urgency}) | Status: {status}")

    print(f"\n  Total Appointments: {len(appointments)}\n")

    # ─── 7. MANUFACTURERS ─────────────────────────────────────
    manufacturer_names = [
        "Sun Pharma", "Cipla", "Dr. Reddy's", "Lupin", "Abbott India",
        "GSK", "Pfizer", "Sanofi", "Biocon", "Zydus Lifesciences"
    ]
    manufacturers = []
    for name in manufacturer_names:
        mfr, created = Manufacturer.objects.get_or_create(manufacturer_name=name)
        manufacturers.append(mfr)
        status = "✓ Created" if created else "• Exists"
        print(f"  {status}: Manufacturer - {name} ({mfr.manufacturer_id})")

    print(f"\n  Total Manufacturers: {len(manufacturers)}\n")

    # ─── 8. MEDICINES ─────────────────────────────────────────
    medicines_data = [
        {"name": "Paracetamol 500mg",    "desc": "Pain reliever and fever reducer",                    "form": "Tablet"},
        {"name": "Amoxicillin 250mg",    "desc": "Antibiotic for bacterial infections",                "form": "Capsule"},
        {"name": "Metformin 500mg",      "desc": "Blood sugar control for Type 2 Diabetes",            "form": "Tablet"},
        {"name": "Atorvastatin 10mg",    "desc": "Cholesterol-lowering statin",                        "form": "Tablet"},
        {"name": "Azithromycin 500mg",   "desc": "Macrolide antibiotic for respiratory infections",     "form": "Tablet"},
        {"name": "Omeprazole 20mg",      "desc": "Proton pump inhibitor for acid reflux",              "form": "Capsule"},
        {"name": "Cetirizine 10mg",      "desc": "Antihistamine for allergy relief",                   "form": "Tablet"},
        {"name": "Ibuprofen 400mg",      "desc": "NSAID for pain and inflammation",                    "form": "Tablet"},
        {"name": "Vitamin D3 60K IU",    "desc": "Vitamin D supplement for bone health",               "form": "Capsule"},
        {"name": "Insulin Glargine",     "desc": "Long-acting insulin for diabetes management",        "form": "Injection"},
        {"name": "Amlodipine 5mg",       "desc": "Calcium channel blocker for hypertension",           "form": "Tablet"},
        {"name": "Salbutamol Inhaler",   "desc": "Bronchodilator for asthma relief",                   "form": "Inhaler"},
    ]
    medicines = []
    for med in medicines_data:
        m, created = Medicine.objects.get_or_create(
            medicine_name=med["name"],
            defaults={"description": med["desc"], "dosage_form": med["form"]}
        )
        medicines.append(m)
        status = "✓ Created" if created else "• Exists"
        print(f"  {status}: Medicine - {m.medicine_name} ({m.medicine_id})")

    print(f"\n  Total Medicines: {len(medicines)}\n")

    # ─── 9. PHARMACIES ────────────────────────────────────────
    pharmacies_data = [
        {"name": "MedPlus Pharmacy",     "street": "12 Anna Salai",           "district": "Chennai Central",  "state": "Tamil Nadu",    "pincode": 600006, "contact": "9200000001"},
        {"name": "Apollo Pharmacy",      "street": "45 MG Road",              "district": "Bangalore South",  "state": "Karnataka",     "pincode": 560099, "contact": "9200000002"},
        {"name": "Wellness Forever",     "street": "78 Hill Road",            "district": "Mumbai West",      "state": "Maharashtra",   "pincode": 400053, "contact": "9200000003"},
        {"name": "NetMeds Store",        "street": "B-5 Sector 18",           "district": "Noida",            "state": "Uttar Pradesh", "pincode": 201301, "contact": "9200000004"},
        {"name": "Practo Pharmacy",      "street": "22 Connaught Place",      "district": "New Delhi",        "state": "Delhi",         "pincode": 110017, "contact": "9200000005"},
        {"name": "Frank Ross",           "street": "15 Park Street",          "district": "Kolkata Central",  "state": "West Bengal",   "pincode": 700016, "contact": "9200000006"},
    ]
    pharmacies = []
    for ph in pharmacies_data:
        pharmacy, created = Pharmacy.objects.get_or_create(
            pharmacy_name=ph["name"],
            defaults={
                "street": ph["street"],
                "district": ph["district"],
                "state": ph["state"],
                "pincode": ph["pincode"],
                "contact": ph["contact"],
                "password": "password123"
            }
        )
        pharmacies.append(pharmacy)
        status = "✓ Created" if created else "• Exists"
        print(f"  {status}: Pharmacy - {pharmacy.pharmacy_name} ({pharmacy.pharmacy_id})")

    print(f"\n  Total Pharmacies: {len(pharmacies)}\n")

    # ─── 10. PHARMACY STOCK ───────────────────────────────────
    stock_configs = [
        # (pharmacy_idx, medicine_idx, manufacturer_idx, price, qty, expiry_offset_days)
        (0, 0, 0, 25.00,   200, 365),
        (0, 1, 1, 85.00,   50,  180),
        (0, 4, 1, 120.00,  30,  270),
        (0, 6, 5, 15.00,   150, 400),
        (1, 0, 0, 22.00,   300, 365),
        (1, 2, 3, 45.00,   100, 300),
        (1, 5, 4, 65.00,   80,  250),
        (1, 7, 0, 35.00,   120, 200),
        (1, 9, 7, 450.00,  15,  150),
        (2, 0, 0, 20.00,   500, 365),
        (2, 3, 2, 95.00,   60,  280),
        (2, 8, 4, 180.00,  40,  350),
        (2, 10, 1, 55.00,  90,  320),
        (3, 0, 5, 18.00,   400, 365),
        (3, 1, 1, 80.00,   70,  200),
        (3, 4, 0, 110.00,  45,  270),
        (3, 6, 5, 12.00,   250, 400),
        (3, 11, 8, 350.00, 25,  180),
        (4, 0, 0, 23.00,   350, 365),
        (4, 2, 3, 48.00,   85,  300),
        (4, 5, 4, 60.00,   95,  250),
        (4, 7, 0, 30.00,   180, 200),
        (4, 9, 7, 420.00,  20,  150),
        (5, 0, 0, 19.00,   600, 365),
        (5, 3, 2, 90.00,   55,  280),
        (5, 8, 4, 175.00,  35,  350),
    ]
    stock_count = 0
    for phi, mi, mfri, price, qty, exp_offset in stock_configs:
        exp_date = today + timedelta(days=exp_offset)
        stock, created = Pharmacy_Medicine.objects.get_or_create(
            pharmacy=pharmacies[phi],
            medicine=medicines[mi],
            manufacturer=manufacturers[mfri],
            defaults={
                "price": Decimal(str(price)),
                "stock_quantity": qty,
                "expiry_date": exp_date,
                "is_available": qty > 0
            }
        )
        stock_count += 1
        status = "✓ Created" if created else "• Exists"
        print(f"  {status}: {pharmacies[phi].pharmacy_name} → {medicines[mi].medicine_name} (₹{price}, Qty: {qty})")

    print(f"\n  Total Stock Entries: {stock_count}\n")

    # ─── SUMMARY ──────────────────────────────────────────────
    print("=" * 60)
    print("  ✅ SEEDING COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print(f"""
  Summary:
  ─────────────────────────────────
  Specializations  :  {len(specializations)}
  Doctors          :  {len(doctors)}
  Hospitals        :  {len(hospitals)}
  Patients         :  {len(patients)}
  Associations     :  {len(associations)}
  Appointments     :  {len(appointments)}
  Manufacturers    :  {len(manufacturers)}
  Medicines        :  {len(medicines)}
  Pharmacies       :  {len(pharmacies)}
  Stock Entries    :  {stock_count}
  ─────────────────────────────────
  TOTAL RECORDS    :  {len(specializations) + len(doctors) + len(hospitals) + len(patients) + len(associations) + len(appointments) + len(manufacturers) + len(medicines) + len(pharmacies) + stock_count}
    """)


if __name__ == '__main__':
    seed()
