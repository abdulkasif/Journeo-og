import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';

import { StatusBar } from 'react-native';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import SplashService from './services/SplashService';
import ProfileScreen from './screens/ProfileScreen';
import TripMapScreen from './screens/TripMapScreen';
import PlaceDetails from './screens/PlaceDetail';
import TripRouteScreen from './screens/TripRouteScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Set SplashService as the initial screen */}
        <Stack.Screen name="Splash" component={SplashService}/>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name='Signup' component={SignupScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen}/>
        <Stack.Screen name='TripMap' component={TripMapScreen}/>
        <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
        <Stack.Screen name="TripRoute" component={TripRouteScreen} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
