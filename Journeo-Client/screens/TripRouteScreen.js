import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const OSRM_SERVER_URL = "http://192.168.31.126:5000/route/v1/driving/";

const TripRouteScreen = ({ route }) => {
  const { tripData } = route.params;
  const { user_latitude, user_longitude, stops } = tripData;
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const validUserLocation = {
    latitude: parseFloat(user_latitude),
    longitude: parseFloat(user_longitude),
  };

  const validPlaces = stops.map((stop) => ({
    latitude: parseFloat(stop.latitude),
    longitude: parseFloat(stop.longitude),
  }));

  useEffect(() => {
    const fetchRoute = async () => {
      const coordinates = [validUserLocation, ...validPlaces, validUserLocation]
        .map(loc => `${loc.longitude},${loc.latitude}`)
        .join(";");

      try {
        const response = await fetch(`${OSRM_SERVER_URL}${coordinates}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const decodedPolyline = decodePolyline(data.routes[0].geometry);
        setRouteCoordinates(decodedPolyline);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
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
      <MapView
        style={styles.map}
        initialRegion={{
          ...validUserLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* User Location Marker */}
        <Marker coordinate={validUserLocation} title="Your Location" pinColor="blue" />

        {/* Places Markers */}
        {validPlaces.map((place, index) => (
          <Marker key={`marker-${index}`} coordinate={place} />
        ))}

        {/* Route Polyline */}
        <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="#09c2f0" />
      </MapView>
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
    height: Dimensions.get("window").height,
  },
});

export default TripRouteScreen;
