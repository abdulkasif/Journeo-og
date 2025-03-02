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
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker for dropdown
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import MyCheckbox from "../components/HomePage/MyCheckBox"; // Import CheckBox component
import styles from "../styles/HomeScreenStyle";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedInterests, setSelectedInterests] = useState([]); // State for interest checkboxes
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
      let formattedAddress = `${reverseGeocode[0].city}, ${reverseGeocode[0].region}`;
      setAddress(formattedAddress);
      setLoading(false);
      await AsyncStorage.setItem("userAddress", formattedAddress);
    }

    
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
    if (
      !address ||
      selectedInterests.length === 0 ||
      !selectedTime ||
      !selectedDistance
    ) {
      Alert.alert(
        "Missing Fields",
        "Please select at least one interest, available time, and distance range."
      );
      return;
    }

    setLoading(true);

    try {
        let loc = await Location.getCurrentPositionAsync({});
        let userCoords = { lat: loc.coords.latitude, lon: loc.coords.longitude };
      
        // Prepare the request body
        const requestBody = {
          location: address,
          latitude: userCoords.lat,
          longitude: userCoords.lon,
          interests: selectedInterests,
          availableTime: parseInt(selectedTime),
          distanceRange: parseInt(selectedDistance),
        };
      
        // Send request to backend to fetch trip plan
        let response = await fetch(
          "https://rjvn06q4-6002.inc1.devtunnels.ms/api/generate-trip",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
      
        if (!response.ok) {
          throw new Error("Failed to fetch trip plan");
        }
      
        let data = await response.json();
        
      
        // Navigate to TripMapScreen with full trip data
        setLoading(false);
        navigation.navigate("TripMap", { tripData: data.trip_plan });
      
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to generate trip.");
        setLoading(false);
      }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prevInterests) =>
      prevInterests.includes(interest)
        ? prevInterests.filter((i) => i !== interest)
        : [...prevInterests, interest]
    );
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

        {/* Interest Checkboxes */}
        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>Select Interests:</Text>
          <ScrollView>
            <MyCheckbox
              title="Nature & Parks"
              checked={selectedInterests.includes("Nature")}
              onValueChange={() => toggleInterest("Nature")}
            />
            <MyCheckbox
              title="Historical Sites"
              checked={selectedInterests.includes("Historic Place")}
              onValueChange={() => toggleInterest("Historic Place")}
            />
            <MyCheckbox
              title="Adventure"
              checked={selectedInterests.includes("Adventure")}
              onValueChange={() => toggleInterest("Adventure")}
            />
            <MyCheckbox
              title="Food & Dining"
              checked={selectedInterests.includes("Food & Dining")}
              onValueChange={() => toggleInterest("Food & Dining")}
            />
          </ScrollView>
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
            <Picker.Item label="0.5 - 1 km (walkable)" value="1" />
            <Picker.Item label="1 - 2 km" value="2" />
            <Picker.Item label="2 - 3 km" value="3" />
            <Picker.Item label="3 - 4 km" value="4" />
            <Picker.Item label="4 - 5 km" value="5" />
            <Picker.Item label="5 - 6 km" value="6" />
            <Picker.Item label="6 - 7 km" value="7" />
            <Picker.Item label="7 - 8 km" value="8" />
            <Picker.Item label="8 - 9 km" value="9" />
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
                editable={true}
                onChangeText={(text) => setAddress(text)}
              />
            </View>

            <TouchableOpacity
              style={styles.detectTextContainer}
              onPress={getLocation}
            > 
            {loading ? (<Text style={styles.detectText}>Detecting Location.....</Text>) : (<Text style={styles.detectText}>Detect Location</Text>)}
            </TouchableOpacity>

            <View style={styles.buttonRowModal}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={async () => {
                  await AsyncStorage.setItem("userAddress", address);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.saveText}>Save Address</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButtonModal}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelTextModal}>Cancel</Text>
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
