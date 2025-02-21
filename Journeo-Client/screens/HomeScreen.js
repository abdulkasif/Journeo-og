import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker for dropdown
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import navigation
import styles from "../styles/HomeScreenStyle";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedInterest, setSelectedInterest] = useState(""); // State for interest dropdown
  const [selectedTime, setSelectedTime] = useState(""); // State for time dropdown
  const [selectedDistance, setSelectedDistance] = useState(""); // State for distance dropdown

  const navigation = useNavigation(); // Initialize navigation

  const getLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access to continue.");
      setLoading(false);
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    console.log(loc);
    let reverseGeocode = await Location.reverseGeocodeAsync(loc.coords);

    if (reverseGeocode.length > 0) {
      let formattedAddress = `${reverseGeocode[0].city}, ${reverseGeocode[0].region}, ${reverseGeocode[0].postalCode}`;
      setAddress(formattedAddress);
      await AsyncStorage.setItem("userAddress", formattedAddress);
    }

    setLoading(false);
    setModalVisible(false);
  };

  const loadStoredLocation = async () => {
    const savedAddress = await AsyncStorage.getItem("userAddress");
    if (savedAddress) {
      setAddress(savedAddress);
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  };

  const fetchNearbyPlaces = async () => {
    if (!address || !selectedInterest || !selectedTime) {
      Alert.alert(
        "Missing Fields",
        "Please select an interest and available time."
      );
      return;
    }

    setLoading(true);

    try {
      // Fetch user location
      let loc = await Location.getCurrentPositionAsync({});
      let userCoords = { lat: loc.coords.latitude, lon: loc.coords.longitude };

      // Send request to backend to fetch amenities
      let response = await fetch(
        `https://rjvn06q4-6002.inc1.devtunnels.ms/api/generate-trip`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch amenities");
      }

      let data = await response.json();

      let places = data.map((place) => ({
        name: place.name,
        lat: place.lat,
        lon: place.lon,
      }));

      if (places.length === 0) {
        Alert.alert("No Places Found", "Try a different interest.");
        setLoading(false);
        return;
      }

      // Select places within available time range
      let selectedPlaces = places.slice(0, 3);

      // Construct trip data
      let tripData = {
        userLocation: userCoords,
        places: selectedPlaces,
        timeLimit: selectedTime,
      };

      setLoading(false);

      // Navigate to Trip Map screen with trip data
      navigation.navigate("TripMap", { tripData });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate trip.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoredLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>Journeo</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="location-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Welcome Card */}
      <View style={styles.card}>
        <Text style={styles.welcomeTitle}>Welcome to Journeo</Text>
        <Text style={styles.welcomeDescription}>
          Your local tour planner. Plan your local tour according to your
          available time.
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Plan Your Trip</Text>

        {/* Interest Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Interest:</Text>
          <Picker
            selectedValue={selectedInterest}
            onValueChange={(itemValue) => setSelectedInterest(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select an interest" value="" />
            <Picker.Item label="Nature & Parks" value="nature" />
            <Picker.Item label="Historical Sites" value="history" />
            <Picker.Item label="Adventure" value="adventure" />
            <Picker.Item label="Food & Dining" value="food" />
          </Picker>
        </View>

        {/* Available Time Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Available Time:</Text>
          <Picker
            selectedValue={selectedTime}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select available time" value="" />
            <Picker.Item label="15 mins" value="15" />
            <Picker.Item label="30 mins" value="30" />
            <Picker.Item label="45 mins" value="45" />
            <Picker.Item label="1 hr" value="60" />
            <Picker.Item label="1 hr 30 mins" value="90" />
            <Picker.Item label="2 hrs" value="120" />
            <Picker.Item label="2 hrs 30 mins" value="150" />
            <Picker.Item label="3 hrs" value="180" />
            <Picker.Item label="3 hrs 30 mins" value="210" />
            <Picker.Item label="4 hrs" value="240" />
          </Picker>
        </View>

        {/* Distance Range Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Distance Range:</Text>
          <Picker
            selectedValue={selectedDistance}
            onValueChange={(itemValue) => setSelectedDistance(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select distance range" value="" />
            <Picker.Item label="0.5 - 1 km (walkable)" value="1000" />
            <Picker.Item label="1 - 2 km" value="2000" />
            <Picker.Item label="2 - 3 km" value="3000" />
            <Picker.Item label="3 - 4 km" value="4000" />
            <Picker.Item label="4 - 5 km" value="5000" />
          </Picker>
        </View>

        {/* Generate Trips Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={fetchNearbyPlaces}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.generateText}>Generate Trips</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Location</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#09c2f05" />
            ) : (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="map"
                  size={20}
                  color="#09c2f0"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="black"
                  value={address}
                  editable={false}
                />
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.detectButton}
                onPress={getLocation}
              >
                <Text style={styles.buttonText}>Detect Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Menu Bar */}
      <View style={styles.menuBar}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setActiveTab("Home")}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color={activeTab === "Home" ? "#09c2f0" : "gray"}
          />
          <Text
            style={[styles.menuText, activeTab === "Home" && styles.activeText]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setActiveTab("Trips")}
        >
          <Ionicons
            name="briefcase-outline"
            size={24}
            color={activeTab === "Trips" ? "#09c2f0" : "gray"}
          />
          <Text
            style={[
              styles.menuText,
              activeTab === "Trips" && styles.activeText,
            ]}
          >
            Trips
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setActiveTab("Profile");
            navigation.navigate("Profile"); // Navigate to Profile
          }}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={activeTab === "Profile" ? "#09c2f0" : "gray"}
          />
          <Text
            style={[
              styles.menuText,
              activeTab === "Profile" && styles.activeText,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
