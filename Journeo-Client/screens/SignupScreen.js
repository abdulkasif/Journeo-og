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
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo's icon library
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

export default function SignupScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation(); 

   const handlePhoneNumberChange = (text) => {
    // Replace any non-numeric characters and limit to 10 digits
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 10);
    setPhoneNumber(numericText);
  };
  // Validate confirm password
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (!username || !phoneNumber || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
  
    try {
      const response = await fetch("https://rjvn06q4-6001.inc1.devtunnels.ms/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
         phonenumber: phoneNumber,
          password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        Alert.alert("Success", "Account created successfully!");
        console.log(data)
        navigation.navigate("Login"); 
      } else {
        const error = await response.json();
        console.log(error)
        Alert.alert("Error", error.message || "Something went wrong.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to connect to the server. Please try again.");
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require("../assets/images/Background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* White Box Container */}
        <View style={styles.whiteBox}>
          <Text style={styles.title}>Create an Account</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#1c3cb5" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="black"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#1c3cb5" style={styles.icon} />
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

          {/* Password Input with Toggle */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#1c3cb5" style={styles.icon} />
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

          {/* Confirm Password Input with Toggle */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#1c3cb5" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="black"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              style={styles.iconRight}
            >
              <Ionicons
                name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#1c3cb5"
              />
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")} // Navigate to Login
          >
            <Text style={styles.footerText}>Already have an account? Log In</Text>
          </TouchableOpacity>
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
  signupButton: {
    backgroundColor: "#1c3cb5",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  signupText: {
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
