
import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

def test_pharmacy_registration():
    url = f"{BASE_URL}/pharmacies/"
    data = {
        "pharmacy_name": "Test Pharmacy API Check",
        "street": "456 Test Ave",
        "district": "Test District",
        "state": "Test State",
        "pincode": 654321,
        "contact": "8888888888",
        "password": "password123"
    }
    print(f"Sending POST to {url}")
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_pharmacy_registration()
