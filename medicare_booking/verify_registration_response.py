
import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

def test_hospital_registration():
    url = f"{BASE_URL}/hospitals/"
    data = {
        "hospital_name": "Test Hospital API Check",
        "street": "123 Test St",
        "district": "Test District",
        "state": "Test State",
        "pincode": 123456,
        "contact": "9999999999",
        "working_hours": "9-5",
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
    test_hospital_registration()
