
import os
import django
import sys

# Setup Django environment
sys.path.append('c:\\Users\\sound\\OneDrive\\Desktop\\Projects\\MEDICARE\\medicare_booking')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicare_booking.settings')
django.setup()


from pharmacies.models import Pharmacy
from hospitals.models import Hospital
from medicare_booking.utils import haversine
from django.test import RequestFactory
from hospitals.views import hospital_search

def verification():
    print("Starting Verification...")
    
    # 1. Test Haversine
    dist = haversine(10.0, 10.0, 10.01, 10.01)
    print(f"Haversine distance (approx 1.5km): {dist:.2f} km")
    
    # 2. Setup Data
    # Clear existing test data if any (optional, but good for cleanliness)
    Pharmacy.objects.filter(pharmacy_name__startswith="Test").delete()
    Hospital.objects.filter(hospital_name__startswith="Test").delete()
    
    # Create Reference Pharmacy
    p1 = Pharmacy.objects.create(
        pharmacy_id="TestPH1",
        pharmacy_name="Test Pharmacy Ref",
        pincode=999001,
        latitude=12.9716, # Bangalore coords
        longitude=77.5946,
        contact="1234567890"
    )
    print(f"Created Pharmacy: {p1.pharmacy_name} at {p1.pincode}")

    # Create Hospital 1 (Exact Match Pincode 999001)
    h1 = Hospital.objects.create(
        hospital_name="Test Hospital Exact",
        location="Bangalore Central",
        pincode=999001,
        latitude=12.9716,
        longitude=77.5946,
        contact="111",
        working_hours="24/7"
    )
    print(f"Created Hospital: {h1.hospital_name} at {h1.pincode}")

    # Create Hospital 2 (Nearby, Pincode 999002, 2km away)
    # 0.018 degrees is roughly 2km
    h2 = Hospital.objects.create(
        hospital_name="Test Hospital Nearby",
        location="Bangalore North",
        pincode=999002,
        latitude=12.9896, 
        longitude=77.5946,
        contact="222",
        working_hours="24/7"
    )
    print(f"Created Hospital: {h2.hospital_name} at {h2.pincode} (Nearby)")

    # Create Hospital 3 (Far, Pincode 999003, 100km away)
    h3 = Hospital.objects.create(
        hospital_name="Test Hospital Far",
        location="Mysore",
        pincode=999003,
        latitude=12.2958,
        longitude=76.6394,
        contact="333",
        working_hours="24/7"
    )
    print(f"Created Hospital: {h3.hospital_name} at {h3.pincode} (Far)")

    # 3. Test Search Logic
    factory = RequestFactory()

    # Test A: Exact Match for 999001
    print("\n--- Test A: Exact Match for 999001 ---")
    request = factory.get('/hospitals/search/', {'pincode': '999001'})
    response = hospital_search(request)
    # We can't easily parse response content without rendering, but we can check the context if we mocked render or check content string
    # Since we reused the view, it returns HttpResponse. 
    # Let's inspect content.
    content = response.content.decode('utf-8')
    if "Test Hospital Exact" in content:
        print("PASS: Found Exact Match Hospital")
    else:
        print("FAIL: Did not find Exact Match Hospital")

    # Test B: Nearby Match for 999004 (No hospital there, but let's assume valid pincode has no reference)
    # Wait, the fallback logic relies on finding a reference entity with that pincode.
    # If I search for 999001, I get exact match.
    # If I search for 999002, I get exact match H2.
    
    # To test fallback, I need a pincode that HAS a reference entity (Pharmacy or Hospital) but NO Hospital matching exact pincode?
    # No, that's not how it works.
    # "If there is no hospital available at that pincode then it should search for nearby location"
    # Case: User enters Pincode X. 
    # 1. Check if ANY hospital has Pincode X. If yes, show them.
    # 2. If NO hospital has Pincode X:
    #    a. Find location of Pincode X. How? By looking up ANY entity (Pharmacy/Hospital) with Pincode X.
    #    b. If found location, search nearby.
    
    # So I need to create a Scenario where:
    # Pharmacy P2 exists at Pincode 999005. 
    # No Hospital exists at Pincode 999005.
    # Existing Hospitals (H1, H2) are nearby P2.
    
    print("\n--- Creating Scenario for Fallback ---")
    p2 = Pharmacy.objects.create(
        pharmacy_id="TestPH2",
        pharmacy_name="Reference Pharmacy for Fallback",
        pincode=999005,
        latitude=12.9800, # Between H1 and H2
        longitude=77.5946,
        contact="444"
    )
    print(f"Created Pharmacy: {p2.pharmacy_name} at {p2.pincode} (Coords: {p2.latitude}, {p2.longitude})")
    
    print("\n--- Test B: Fallback Search for 999005 ---")
    request = factory.get('/hospitals/search/', {'pincode': '999005'})
    response = hospital_search(request)
    content = response.content.decode('utf-8')
    
    if "No hospitals found exactly at this pincode" in content:
        print("PASS: Triggered Fallback Message")
    else:
        print("FAIL: Did not trigger Fallback Message")
        
    if "Test Hospital Exact" in content and "Test Hospital Nearby" in content:
        print("PASS: Found Nearby Hospitals (H1, H2)")
    else:
        print("FAIL: Did not find Nearby Hospitals")
        
    if "Test Hospital Far" in content:
        print("FAIL: Found Far Hospital (Should be filtered out)")
    else:
        print("PASS: Far Hospital filtered out")

    # Cleanup
    p1.delete()
    p2.delete()
    h1.delete()
    h2.delete()
    h3.delete()
    print("\nVerification Complete.")

if __name__ == "__main__":
    verification()
