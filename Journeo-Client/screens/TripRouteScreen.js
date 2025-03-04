import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text, ScrollView } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const OSRM_SERVER_URL = "http://192.168.85.157:5000/route/v1/driving/";
const COLORS = ["#09c2f0", "#ff5733", "#28a745", "#f0ad4e", "#9b59b6"]; // Colors for each segment

const TripRouteScreen = ({ route }) => {
  const { tripData } = route.params;
  const { user_latitude, user_longitude, stops } = tripData;
  const [routeSegments, setRouteSegments] = useState([]);

  const validUserLocation = {
    latitude: parseFloat(user_latitude),
    longitude: parseFloat(user_longitude),
  };

  const validPlaces = stops.map((stop) => ({
    latitude: parseFloat(stop.latitude),
    longitude: parseFloat(stop.longitude),
    name: stop.name,
    visit_duration: stop.visit_duration,
    activities: stop.activities,
  }));

  useEffect(() => {
    const fetchRoutes = async () => {
      let segments = [];
      const waypoints = [validUserLocation, ...validPlaces, validUserLocation];

      for (let i = 0; i < waypoints.length - 1; i++) {
        const start = waypoints[i];
        const end = waypoints[i + 1];
        const routeUrl = `${OSRM_SERVER_URL}${start.longitude},${start.latitude};${end.longitude},${end.latitude}`;

        try {
          const response = await fetch(routeUrl);
          if (!response.ok) throw new Error("Route fetch failed");
          const data = await response.json();
          const decodedPolyline = decodePolyline(data.routes[0].geometry);

          segments.push({
            coordinates: decodedPolyline,
            color: COLORS[i % COLORS.length], // Assign color dynamically
          });
        } catch (error) {
          console.error(`Error fetching route segment ${i}:`, error);
        }
      }

      setRouteSegments(segments);
    };

    fetchRoutes();
  }, [validUserLocation, validPlaces]);

  const decodePolyline = (encodedPolyline) => {
    let index = 0, len = encodedPolyline.length;
    let lat = 0, lng = 0;
    let coordinates = [];

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encodedPolyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encodedPolyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      coordinates.push({
        latitude: lat * 1e-5,
        longitude: lng * 1e-5,
      });
    }

    return coordinates;
  };

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        style={styles.map}
        initialRegion={{
          ...validUserLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={validUserLocation} title="Your Location" pinColor="blue" />

        {validPlaces.map((place, index) => (
          <Marker key={`marker-${index}`} coordinate={place} title={place.name} />
        ))}

        {routeSegments.map((segment, index) => (
          <Polyline
            key={`polyline-${index}`}
            coordinates={segment.coordinates}
            strokeWidth={4}
            strokeColor={segment.color}
          />
        ))}
      </MapView>

      {/* Trip Details Section */}
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.header}>Trip Plan</Text>
        {validPlaces.map((place, index) => (
          <View key={`place-${index}`} style={styles.stopContainer}>
            <Text style={styles.stopTitle}>
              {index === 0 ? "1. Your location to " : `${index + 1}. Stop ${index} to `} 
              {place.name}
            </Text>
            <Text style={styles.info}>📍 Place: {place.name}</Text>
            <Text style={styles.info}>⏳ Visit Duration: {place.visit_duration} mins</Text>
            <Text style={styles.info}>🎯 Activities: {place.activities.join(", ")}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2, // Half screen map
  },
  detailsContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#09c2f0",
    marginBottom: 10,
  },
  stopContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#09c2f0",
  },
  stopTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: "#555",
  },
});

export default TripRouteScreen;
