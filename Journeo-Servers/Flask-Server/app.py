from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Set OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.route("/api/generate-trip", methods=["POST"])
def generate_trip():
    data = request.json
    location = data.get("location", "Villapuram, Madurai, Tamil Nadu (Pincode: 625012)")
    interest = data.get("interest")
    available_time = int(data.get("availableTime", 0))
    distance_range = data.get("distanceRange")

    min_spots = 3 if available_time <= 60 else 6

    # Updated prompt to prevent location confusion
    prompt = f"""
    You are an AI travel planner. Generate a trip plan in **strict JSON format** based on the user's preferences.
    Ensure the response **ONLY contains JSON** without any additional text or explanations.

    **Rules:**
    - The number of stops should be at least {min_spots}.
    - Each stop **must be within {distance_range} m** of the start location.
    - Each stop must include **coordinates (latitude & longitude)** and a **full address**.
    - The trip must be **optimized within {available_time} minutes**.
      # - The **correct start location is**: "Villapuram, Madurai, Tamil Nadu (Pincode: 625012)"  
     # - The exact **latitude and longitude** of Villapuram (Madurai) is:
     #   - **Latitude**: 9.8829  
     #   - **Longitude**: 78.0782 
    
    

    **Output JSON format:**
    {{
      "trip_plan": {{
        "start_location": "{location}",
        "total_duration": "{available_time} minutes",
        "stops": [
          {{
            "name": "PLACE_NAME",
            "distance": "DISTANCE km",
            "travel_time": "TIME min",
            "visit_duration": "TIME min",
            "latitude": "LATITUDE",
            "longitude": "LONGITUDE",
            "address": "FULL_ADDRESS",
            "description": "SHORT_DESCRIPTION",
            "activities": ["ACTIVITY_1", "ACTIVITY_2", "ACTIVITY_3"]
          }}
        ],
        "return": {{
          "destination": "{location}",
          "travel_time": "TIME min"
        }}
      }}
    }}
    """

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 10000,
                "temperature": 0.2,  # Reduce randomness
                "top_p": 0.8,  # Increase response accuracy
            },
        )

        if response.status_code == 200:
            result = response.json()
            response_text = result.get("choices", [{}])[0].get("message", {}).get("content", "").strip()

            match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if match:
                trip_plan_json = match.group(0)
                return jsonify(json.loads(trip_plan_json))
            else:
                return jsonify({"error": "Invalid JSON format from AI"}), 500
        else:
            print("API Error Response:", response.text)
            return jsonify({"error": "Failed to generate trip plan"}), 500

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=6002, host='0.0.0.0')
