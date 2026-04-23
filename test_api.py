# File: test_api.py (text-bison-001 version)

import os
import requests
import json
from dotenv import load_dotenv

print("Attempting to load .env file...")
load_dotenv()
print(".env file loaded.")

api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    print("\nFATAL ERROR: Could not find GEMINI_API_KEY in your .env file.")
else:
    print(f"API Key found, starting with '...{api_key[-4:]}'")

    # URL for the PaLM 2 model (text-bison-001)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key={api_key}"

    headers = {
        'Content-Type': 'application/json'
    }

    # Data structure for the PaLM 2 model
    data = {
      "prompt": {
        "text": "Hello"
      }
    }

    try:
        print(f"\nSending a POST request to the PaLM 2 API endpoint...")
        
        response = requests.post(url, headers=headers, data=json.dumps(data))
        
        if response.status_code == 200:
            response_json = response.json()
            text_content = response_json['candidates'][0]['output']
            
            print("\nSUCCESS! The AI (text-bison-001) responded:")
            print("---------------------------------------------")
            print(text_content.strip())
            print("---------------------------------------------")
        else:
            print("\nAN ERROR OCCURRED (from requests):")
            print("---------------------------------")
            print(f"Status Code: {response.status_code}")
            print(f"Response Body: {response.text}")
            print("---------------------------------")

    except Exception as e:
        print("\nAN ERROR OCCURRED (during request):")
        print("-----------------------------------")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Details: {e}")
        print("-----------------------------------")