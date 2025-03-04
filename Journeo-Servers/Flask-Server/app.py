from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import random
from math import radians, sin, cos, sqrt, atan2

app = Flask(__name__)
CORS(app)

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

@app.route("/api/generate-trip", methods=["POST"])
def generate_trip():
    data = request.json
    location = data.get("location")
    interests = data.get("interests", [])
    available_time = int(data.get("availableTime", 0))
    distance_range = float(data.get("distanceRange", 5))  # Default 5km

    user_lat = float(data.get("latitude"))
    user_lon = float(data.get("longitude"))

    # Filter places based on interest and distance
    interest_based_places = []

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
            interest_based_places.append(place_info)

    if not interest_based_places:
        return jsonify({"error": "Not enough places found within the distance range"}), 400

    # Step 1: Sort the places by distance from the user
    interest_based_places.sort(key=lambda place: place["distance"])

    # Step 2: Select stops within the available time limit
    selected_stops = []
    total_time = 0

    for place in interest_based_places:
        if total_time + place["travel_time"] + place["visit_duration"] <= available_time:
            selected_stops.append(place)
            total_time += place["travel_time"] + place["visit_duration"]

    if not selected_stops:
        return jsonify({"error": "Not enough places fit within the available time"}), 400

    # Step 3: Arrange stops in the optimal order by selecting the nearest place at each step
    ordered_stops = []
    current_location = (user_lat, user_lon)

    while selected_stops:
        # Find the closest stop
        selected_stops.sort(key=lambda stop: calculate_distance(current_location[0], current_location[1], stop["latitude"], stop["longitude"]))
        next_stop = selected_stops.pop(0)  # Pick the closest stop
        ordered_stops.append(next_stop)
        current_location = (next_stop["latitude"], next_stop["longitude"])  # Move to the new stop

    trip_plan = {
        "trip_plan": {
            "start_location": location,
            "user_latitude": user_lat,
            "user_longitude": user_lon,
            "total_duration": f"{total_time} minutes",
            "stops": ordered_stops,
            "return": {
                "travel_time": f"{sum(place['travel_time'] for place in ordered_stops):.0f} min"
            }
        }
    }

    return jsonify(trip_plan)

if __name__ == "__main__":
    app.run(debug=True, port=6002, host="0.0.0.0")
