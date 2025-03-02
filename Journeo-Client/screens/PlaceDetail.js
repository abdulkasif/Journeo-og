import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";

const PlaceDetails = ({ route }) => {
  const { place } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: place.latitude,
            longitude: place.longitude,
          }}
          title={place.name}
          description={place.address}
        />
      </MapView>
      <ScrollView style={styles.detailsContainer} contentContainerStyle={styles.detailsContent}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeAddress}>{place.address}</Text>
        <Text style={styles.placeDescription}>{place.description}</Text>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Interest</Text>
          <Text style={styles.infoDetail}>{place.interest}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Visit Duration</Text>
          <Text style={styles.infoDetail}>{place.visit_duration} minutes</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Activities</Text>
          <Text style={styles.infoDetail}>{place.activities.join(", ")}</Text>
        </View>
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
    height: Dimensions.get("window").height / 3, // One-third of the screen height
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  detailsContent: {
    paddingVertical: 10,
  },
  placeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#09c2f0",
    marginBottom: 10,
  },
  placeAddress: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  placeDescription: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  infoDetail: {
    fontSize: 16,
    color: "#555",
  },
});

export default PlaceDetails;
