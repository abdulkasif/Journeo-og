import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert, // Import for showing alert messages
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState(""); // Add state for password
  const navigation = useNavigation();

  // Handle phone number input to limit to 10 digits
  const handlePhoneNumberChange = (text) => {
    // Replace any non-numeric characters and limit to 10 digits
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 10);
    setPhoneNumber(numericText);
  };
  // Handle login button press
  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password.");
      return;
    }

    try {
      const response = await fetch(
        "https://rjvn06q4-6001.inc1.devtunnels.ms/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phonenumber: phoneNumber,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        // Handle successful login
        Alert.alert("Success", "Login successful!");
    
        navigation.navigate("Home"); // Navigate to the home screen
      } else {
        // Handle errors returned by the backend
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/Background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.whiteBox}>
          <Text style={styles.title}>Welcome to Journeo</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#1c3cb5"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="black"
              keyboardType="numeric"
              maxLength={10}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#1c3cb5"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="black"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.iconRight}
            >
              <Ionicons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#1c3cb5"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={[styles.footerText, { fontWeight: "bold" }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1c3cb5",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    width: "100%",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
  iconRight: {
    marginLeft: "auto",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "black",
  },
  loginButton: {
    backgroundColor: "#1c3cb5",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 15,
    color: "#1c3cb5",
    fontSize: 14,
  },
});
