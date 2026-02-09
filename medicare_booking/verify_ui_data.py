
import os
import django
import sys
from django.test import RequestFactory
# Setup Django environment
sys.path.append('c:\\Users\\sound\\OneDrive\\Desktop\\Projects\\MEDICARE\\medicare_booking')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicare_booking.settings')
django.setup()

from pharmacies.models import Pharmacy
from hospitals.models import Hospital
from pharmacies.views import pharmacy_list
from hospitals.views import hospital_search

def verification():
    print("Starting Verification...")
    
    # 1. Check Data Population
    p_count = Pharmacy.objects.count()
    h_count = Hospital.objects.count()
    
    print(f"Pharmacies Count: {p_count}")
    print(f"Hospitals Count: {h_count}")
    
    if p_count >= 5 and h_count >= 4:
        print("PASS: Data appears to be populated.")
    else:
        print("FAIL: Data population insufficient.")
        
    # 2. Check UI Structure (CSS Classes)
    factory = RequestFactory()
    
    # Check Pharmacy List for content-card
    request = factory.get('/pharmacies/')
    response = pharmacy_list(request)
    content = response.content.decode('utf-8')
    
    if 'class="content-card"' in content:
        print("PASS: Pharmacy List has 'content-card' class.")
    else:
        print("FAIL: Pharmacy List missing 'content-card' class.")
        
    # Check Hospital Search for content-card
    request = factory.get('/hospitals/search/')
    response = hospital_search(request)
    content = response.content.decode('utf-8')
    
    if 'class="content-card"' in content:
        print("PASS: Hospital Search has 'content-card' class.")
    else:
        print("FAIL: Hospital Search missing 'content-card' class.")

    # 3. Check Pharmacy Fallback Logic (Data-based)
    # We populate "MedPlus Koramangala" at 560034.
    # We populate "St. John's Medical College" at 560034.
    
    # Let's search for a pincode that DOES NOT exist but is near 560034.
    # 560030 is Adugodi, might be close.
    # Or we can just mock a request for 560099 (Narayana Health City) and see if we find others if we didn't have a pharmacy there.
    # But we didn't create a pharmacy at 560099 in sample data.
    # "Narayana Health City" is at 560099.
    # So if we search Pharmacy at 560099, we should find "No pharmacies found exactly..."
    # And then it should check Hospital at 560099 (which exists: Narayana Health City).
    # Then it should find nearby pharmacies like MedPlus (approx 15km away).
    
    print("\n--- Testing Pharmacy Fallback ---")
    request = factory.get('/pharmacies/', {'pincode': '560099'})
    response = pharmacy_list(request)
    content = response.content.decode('utf-8')
    
    if "No pharmacies found exactly at this pincode" in content:
        print("PASS: Fallback message present.")
    else:
        print("FAIL: Fallback message missing.")
        
    if "MedPlus Koramangala" in content: # Should be within 50km
         print("PASS: Found nearby pharmacy (MedPlus).")
    else:
         print("FAIL: Did not find nearby pharmacy.")
         
    print("\nVerification Complete.")

if __name__ == "__main__":
    verification()
