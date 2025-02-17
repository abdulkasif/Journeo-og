import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRoute } from "@react-navigation/native";

export default function TripMapScreen() {
  const route = useRoute();
  const { tripData } = route.params;
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoute();
  }, []);

  const fetchRoute = async () => {
    if (!tripData || !tripData.places || !tripData.userLocation) {
      console.error("Invalid tripData structure:", tripData);
      setLoading(false);
      return;
    }
  
    // Correctly format the coordinates as "latitude,longitude"
    let coords = tripData.places.map((place) => `${place.lat},${place.lon}`).join("|");
    let start = `${tripData.userLocation.lat},${tripData.userLocation.lon}`;
  
    try {
      let response = await fetch(
        `https://graphhopper.com/api/1/route?point=${start}&point=${coords}&profile=car&key=06a3c8c9-ba68-4c0f-b98e-1cc03251c462  `
      );
  
      if (!response.ok) {
        // Log the response text for more details
        let errorText = await response.text();
        console.error("Error response from API:", errorText);
        throw new Error("Network response was not ok");
      }
  
      let data = await response.json();
      console.log("API Response:", data); // Debugging line
  
      if (data.paths && data.paths[0] && data.paths[0].points) {
        let polylineCoords = data.paths[0].points.coordinates.map(([lon, lat]) => ({
          latitude: lat,
          longitude: lon,
        }));
  
        setRouteCoordinates(polylineCoords);
      } else {
        console.error("Unexpected API response structure:", data);
      }
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching route:", error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <MapView style={styles.map} initialRegion={{
          latitude: tripData.userLocation.lat,
          longitude: tripData.userLocation.lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
          <Marker coordinate={{
            latitude: tripData.userLocation.lat,
            longitude: tripData.userLocation.lon
          }} title="You" pinColor="blue" />

          {tripData.places.map((place, index) => (
            <Marker key={index} coordinate={{
              latitude: place.lat,
              longitude: place.lon
            }} title={place.name} />
          ))}

          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" }
});
