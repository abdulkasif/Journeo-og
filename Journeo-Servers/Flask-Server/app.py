from flask import Flask, request, jsonify
from flask_cors import CORS
<<<<<<< HEAD
import pandas as pd
import os
from math import radians, sin, cos, sqrt, atan2
=======
import requests
import os
import json
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
>>>>>>> 98208a5f3f7e9bbc7eb344caff710d69a0a8cebc

app = Flask(__name__)
CORS(app)

<<<<<<< HEAD
# Load Excel file
EXCEL_PATH = os.path.join(os.getcwd(), "data", "PlacesInMadurai.xlsx")
places_df = pd.read_excel(EXCEL_PATH)


# Function to calculate distance using the Haversine formula
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c  # Distance in km

=======
# Set OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
>>>>>>> 98208a5f3f7e9bbc7eb344caff710d69a0a8cebc

@app.route("/api/generate-trip", methods=["POST"])
def generate_trip():
    data = request.json
<<<<<<< HEAD
    print(data)
    location = data.get("location")
    interests = data.get("interests", [])
    available_time = int(data.get("availableTime", 0))
    distance_range = float(data.get("distanceRange", 5))  # Default 5km

    user_lat = float(data.get("latitude"))
    user_lon = float(data.get("longitude"))

    # Filter places based on interest and distance
    interest_based_places = {interest: [] for interest in interests}

    for _, row in places_df.iterrows():
        place_lat = float(row["Latitude"])
        place_lon = float(row["Longitude"])
        distance = calculate_distance(user_lat, user_lon, place_lat, place_lon)

        visit_duration = row.get("visit_duration", 30)  # Default 30 min
        travel_time = (distance / 40) * 60  # Assuming 40 km/h speed

        if row["Type"] in interests and distance <= distance_range:
            place_info = {
                "name": row["place_name"],
                "distance": distance,
                "latitude": place_lat,
                "longitude": place_lon,
                "address": row.get("Address", "Unknown Address"),
                "description": row.get("Description", ""),
                "activities": row.get("Activities", "").split(","),
                "travel_time": travel_time,
                "visit_duration": visit_duration,
                "interest": row["Type"]
            }
            interest_based_places[row["Type"]].append(place_info)

    # Sort each interest category by shortest distance
    for interest in interest_based_places:
        interest_based_places[interest].sort(key=lambda x: x["distance"])

    # Select at least one place from each interest while keeping within available time
    selected_stops = []
    total_time = 0

    # First, pick one place per interest category
    for interest in interests:
        if interest_based_places[interest]:
            place = interest_based_places[interest][0]  # Closest place of this interest
            if total_time + place["travel_time"] + place["visit_duration"] <= available_time:
                selected_stops.append(place)
                total_time += place["travel_time"] + place["visit_duration"]

    # Then, add additional places from any category, prioritizing by shortest distance
    remaining_places = sorted(
        [place for places in interest_based_places.values() for place in places],
        key=lambda x: x["distance"]
    )

    for place in remaining_places:
        if place not in selected_stops and total_time + place["travel_time"] + place["visit_duration"] <= available_time:
            selected_stops.append(place)
            total_time += place["travel_time"] + place["visit_duration"]

    if not selected_stops:
        return jsonify({"error": "Not enough places found within the distance range"}), 400

    trip_plan = {
        "trip_plan": {
            "start_location": location,
            "user_latitude": user_lat,
            "user_longitude": user_lon,
            "total_duration": f"{total_time} minutes",
            "stops": selected_stops,
            "return": {
                "travel_time": f"{sum(place['travel_time'] for place in selected_stops):.0f} min"
            }
        }
    }

    return jsonify(trip_plan)


if __name__ == "__main__":
    app.run(debug=True, port=6002, host="0.0.0.0")
=======
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
>>>>>>> 98208a5f3f7e9bbc7eb344caff710d69a0a8cebc
