import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
const SplashService = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          navigation.navigate("Home");
        } else {
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserData();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1c3cb5" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default SplashService;
