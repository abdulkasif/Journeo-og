import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("John Doe");
  const [phoneNumber, setPhoneNumber] = useState("+123 456 7890");
  const [address, setAddress] = useState("Fetching address...");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadAddress();
  }, []);

  const loadAddress = async () => {
    const storedAddress = await AsyncStorage.getItem("userAddress");
    if (storedAddress) setAddress(storedAddress);
  };

  const getLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access to continue.");
      setLoading(false);
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    let reverseGeocode = await Location.reverseGeocodeAsync(loc.coords);
    if (reverseGeocode.length > 0) {
      let formattedAddress = `${reverseGeocode[0].city}, ${reverseGeocode[0].region}, ${reverseGeocode[0].postalCode}`;
      setAddress(formattedAddress);
      await AsyncStorage.setItem("userAddress", formattedAddress);
    }
    setLoading(false);
    setModalVisible(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Profile</Text>
      </View>

      {/* Profile Details */}
      <View style={styles.profileContainer}>
        <View style={styles.row}>
          <Ionicons name="person" size={24} color="#1c3cb5" />
          <Text style={styles.infoText}>{name}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="call" size={24} color="#1c3cb5" />
          <Text style={styles.infoText}>{phoneNumber}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="location" size={24} color="#1c3cb5" />
          <Text style={styles.infoText}>{address}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="pencil" size={20} color="#1c3cb5" style={styles.editIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Address Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Address</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#1c3cb5" />
            ) : (
              <TextInput
                style={styles.input}
                value={address}
                editable={false}
                placeholder="Fetching location..."
              />
            )}
            <TouchableOpacity style={styles.detectButton} onPress={getLocation}>
              <Text style={styles.buttonText}>Detect Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topBar: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    elevation: 5,
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1c3cb5",
  },
  profileContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    color: "#333",
  },
  editIcon: {
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#1c3cb5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 430
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1c3cb5",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
    textAlign: "center",
  },
  detectButton: {
    backgroundColor: "#1c3cb5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  cancelText: {
    color: "#333",
    fontSize: 16,
  },
});
