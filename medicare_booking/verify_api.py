
import os
import django
import sys
from django.test import RequestFactory
from django.conf import settings

# Setup Django environment
sys.path.append('c:\\Users\\sound\\OneDrive\\Desktop\\Projects\\MEDICARE\\medicare_booking')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicare_booking.settings')
django.setup()

from rest_framework.test import APIRequestFactory
from pharmacies.views import PharmacySearchAPIView
from hospitals.views import HospitalSearchAPIView


def verify_api():
    print("Starting API Verification...")
    factory = APIRequestFactory()

    # 1. Test Pharmacy Search API
    print("\n--- Testing Pharmacy API ---")
    
    # a. Missing Pincode
    request = factory.get('/pharmacies/api/search/')
    view = PharmacySearchAPIView.as_view()
    response = view(request)
    if response.status_code == 400:
        print("PASS: Missing pincode returns 400.")
    else:
        print(f"FAIL: Missing pincode returned {response.status_code}")

    # b. Valid Pincode (Fallback check) - Using 560099 (Narayana Health City exists, Pharmacy doesn't)
    request = factory.get('/pharmacies/api/search/', {'pincode': '560099'})
    response = view(request)
    if response.status_code == 200:
        print("PASS: Valid pincode returns 200.")
        data = response.data
        if data['results']:
            print(f"PASS: Found {len(data['results'])} pharmacies via fallback.")
            print(f"Message: {data['message']}")
        else:
             print("FAIL: Fallback returned no results (expected nearby pharmacies).")
    else:
        print(f"FAIL: Valid pincode returned {response.status_code}")


    # 2. Test Hospital Search API
    print("\n--- Testing Hospital API ---")
    view = HospitalSearchAPIView.as_view()
    
    # a. Valid Pincode (Exact match check) - Using 560034 (St. Johns)
    request = factory.get('/hospitals/api/search/', {'pincode': '560034'})
    response = view(request)
    if response.status_code == 200:
        print("PASS: Valid pincode returns 200.")
        data = response.data
        found = False
        for h in data['results']:
            if "St. John's Medical College" in h['hospital_name']:
                found = True
                break
        if found:
            print("PASS: Found exact match hospital.")
        else:
            print("FAIL: Exact match hospital not found in results.")
    else:
        print(f"FAIL: Valid pincode returned {response.status_code}")

    print("\nAPI Verification Complete.")

if __name__ == "__main__":
    verify_api()
