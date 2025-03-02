import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TripMapScreen = ({ route }) => {
  const { tripData } = route.params;
  const { user_latitude, user_longitude, stops, total_duration } = tripData;
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const navigation = useNavigation();

  // Ensure user location is correctly formatted
  const validUserLocation = {
    latitude: parseFloat(user_latitude),
    longitude: parseFloat(user_longitude),
  };

  // Check if user location is valid
  if (isNaN(validUserLocation.latitude) || isNaN(validUserLocation.longitude)) {
    Alert.alert("Invalid user location data.");
    return null;
  }

  // Process stops with valid coordinates
  const validPlaces = stops
    .map((stop) => ({
      name: stop.name,
      address: stop.address,
      latitude: parseFloat(stop.latitude),
      longitude: parseFloat(stop.longitude),
      description: stop.description,
      activities: stop.activities,
      interest: stop.interest,
      visit_duration: stop.visit_duration,
    }))
    .filter((stop) => !isNaN(stop.latitude) && !isNaN(stop.longitude));

  useEffect(() => {
    if (mapRef.current && validPlaces.length > 0) {
      const coordinates = [validUserLocation, ...validPlaces];

      // Fit the map to the coordinates
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [validPlaces]);

  const handlePlacePress = (place) => {
    setSelectedPlace(place);
    mapRef.current.animateToRegion({
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    navigation.navigate("PlaceDetails", { place });
  };

  const handleStartTrip = () => {
    // Implement the logic to start the trip
    Alert.alert("Trip Started", "Your journey has begun!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>Journeo</Text>
        <TouchableOpacity onPress={() => mapRef.current.animateToRegion(validUserLocation)}>
          <Ionicons name="location-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...validUserLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={validUserLocation}
          title="Your Location"
          description={`Time Limit: ${total_duration} mins`}
          pinColor="blue"
        />

        {/* Places Markers */}
        {validPlaces.map((place, index) => (
          <Marker
            key={`marker-${index}`}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.address}
            onPress={() => handlePlacePress(place)}
          />
        ))}
      </MapView>

      {/* Scrollable List of Places */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContainer}>
        {validPlaces.map((item, index) => (
          <TouchableOpacity
            key={`place-${index}`}
            style={[
              styles.listItem,
              selectedPlace?.name === item.name && styles.selectedListItem,
            ]}
            onPress={() => handlePlacePress(item)}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{item.name}</Text>
              <Text style={styles.listItemAddress}>{item.address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#09c2f0" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Start Trip Button */}
      <TouchableOpacity style={styles.startTripButton} onPress={handleStartTrip}>
        <Text style={styles.startTripText}>Start the Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
  },
  appName: { fontSize: 20, fontWeight: "bold", color: "#09c2f0" },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2, // Half of the screen height
  },
  list: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    paddingVertical: 10,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedListItem: {
    backgroundColor: "#e0f7fa", // Light blue background for selected item
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  listItemAddress: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  startTripButton: {
    backgroundColor: "#09c2f0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  startTripText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TripMapScreen;
