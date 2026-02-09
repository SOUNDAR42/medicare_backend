
import os
import django
import sys
import random

# Setup Django environment
sys.path.append('c:\\Users\\sound\\OneDrive\\Desktop\\Projects\\MEDICARE\\medicare_booking')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicare_booking.settings')
django.setup()

from pharmacies.models import Pharmacy
from hospitals.models import Hospital

def populate():
    print("Populating sample data...")

    # Clear existing data? Maybe not, just add new ones or update existing if possible/safe.
    # For this task, let's create a specific set of data for testing.
    
    # Base Coords: Bangalore (approx 12.9716, 77.5946)
    
    # 1. Pharmacies
    pharmacies_data = [
        {"name": "Apollo Pharmacy Indiranagar", "pincode": 560038, "lat": 12.9784, "lon": 77.6408},
        {"name": "MedPlus Koramangala", "pincode": 560034, "lat": 12.9345, "lon": 77.6268},
        {"name": "Wellness Forever Jayanagar", "pincode": 560041, "lat": 12.9304, "lon": 77.5834},
        {"name": "Frank Ross Pharmacy MG Road", "pincode": 560001, "lat": 12.9756, "lon": 77.6097},
        {"name": "Trust Chemists Whitefield", "pincode": 560066, "lat": 12.9698, "lon": 77.7500}
    ]

    for p_data in pharmacies_data:
        # Check if exists by name to avoid duplicates
        if not Pharmacy.objects.filter(pharmacy_name=p_data["name"]).exists():
            Pharmacy.objects.create(
                pharmacy_name=p_data["name"],
                pincode=p_data["pincode"],
                latitude=p_data["lat"],
                longitude=p_data["lon"],
                contact=f"98{random.randint(10000000, 99999999)}"
            )
            print(f"Created Pharmacy: {p_data['name']}")
        else:
            print(f"Pharmacy {p_data['name']} already exists.")

    # 2. Hospitals
    hospitals_data = [
        {"name": "Manipal Hospital Old Airport Rd", "location": "Old Airport Road", "pincode": 560017, "lat": 12.9592, "lon": 77.6482},
        {"name": "Fortis Hospital Bannerghatta", "location": "Bannerghatta Road", "pincode": 560076, "lat": 12.8955, "lon": 77.5983},
        {"name": "Narayana Health City", "location": "Bommasandra", "pincode": 560099, "lat": 12.8055, "lon": 77.6974},
        {"name": "St. John's Medical College", "location": "Koramangala", "pincode": 560034, "lat": 12.9306, "lon": 77.6200} # Same pincode as MedPlus
    ]

    for h_data in hospitals_data:
        if not Hospital.objects.filter(hospital_name=h_data["name"]).exists():
            Hospital.objects.create(
                hospital_name=h_data["name"],
                location=h_data["location"],
                pincode=h_data["pincode"],
                latitude=h_data["lat"],
                longitude=h_data["lon"],
                contact=f"080{random.randint(1000000, 9999999)}",
                working_hours="24 Hours"
            )
            print(f"Created Hospital: {h_data['name']}")
        else:
            print(f"Hospital {h_data['name']} already exists.")
            
    print("Population complete.")

if __name__ == '__main__':
    populate()
