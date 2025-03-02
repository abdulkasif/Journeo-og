import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Alert, Text, FlatList, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";

const TripMapScreen = ({ route }) => {
  const { tripData } = route.params;
  const { user_latitude, user_longitude, stops, total_duration } = tripData;
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

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
    }))
    .filter(
      (stop) => !isNaN(stop.latitude) && !isNaN(stop.longitude)
    );

  useEffect(() => {
    if (mapRef.current && validPlaces.length > 0) {
      const coordinates = [
        validUserLocation,
        ...validPlaces,
      ];

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
  };

  return (
    <View style={styles.container}>
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

      {/* List of Places */}
      <FlatList
        style={styles.list}
        data={validPlaces}
        keyExtractor={(item, index) => `place-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.listItem, selectedPlace?.name === item.name && styles.selectedListItem]}
            onPress={() => handlePlacePress(item)}
          >
            <Text style={styles.listItemTitle}>{item.name}</Text>
            <Text style={styles.listItemAddress}>{item.address}</Text>
            {/* {selectedPlace?.name === item.name && (
              <Image
                source={require('./assets/selected.png')} // Add a checkmark or highlight icon
                style={styles.selectedIcon}
              />
            )} */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2, // Half of the screen height
  },
  list: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedListItem: {
    backgroundColor: '#e0f7fa', // Light blue background for selected item
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listItemAddress: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  selectedIcon: {
    width: 20,
    height: 20,
    tintColor: '#007BFF', // Blue color for the selected icon
  },
});

export default TripMapScreen;
