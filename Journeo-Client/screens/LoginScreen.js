import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number input
  const [password, setPassword] = useState(""); // State for password input
  const navigation = useNavigation(); // Navigation hook

  // Function to handle phone number input and limit to 10 digits
  const handlePhoneNumberChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 10);
    setPhoneNumber(numericText);
  };

  // Function to handle login logic
  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password.");
      return;
    }
    try {
      const response = await fetch(
        "https://gz64vwtx-6001.inc1.devtunnels.ms/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phonenumber: phoneNumber, password: password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user)); // Store user data in AsyncStorage
        Alert.alert("Success", "Login successful!");
        navigation.navigate("Home"); // Navigate to Home screen after login
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/loginbackground.png")} // Background image for login screen
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.whiteBox}>
          <Text style={styles.title}>Welcome to Journeo</Text>

          {/* Input field for phone number */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#09c2f0" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={10}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
            />
          </View>

          {/* Input field for password with toggle visibility */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#09c2f0" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#09c2f0" />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          {/* Navigation to Sign Up */}
          <Text style={styles.footerText}>
            Don't have an account? 
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={[styles.signupText, { color: "#1572A1", fontWeight: "500" }]}> Sign Up</Text>


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
    padding: 25,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#09c2f0",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#09c2f0",
    borderRadius: 10,
    backgroundColor: "#f1f8ff",
    paddingHorizontal: 12,
    marginBottom: 15,
    width: "100%",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "black",
  },
  loginButton: {
    backgroundColor: "#09c2f0", // Primary button color
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 15,
    fontSize: 14,
    color: "#09c2f0",
  },
  signupText: {
    fontWeight: "bold",
    color: "#1572A1", // Updated to medium-dark blue for Sign Up text
  },
});