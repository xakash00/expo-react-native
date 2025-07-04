import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import HomeScreen from '../src/Screens/HomeScreen'; // Updated path if you're not using path aliases

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const loadFonts = async () => {
    await Font.loadAsync({
      'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
      'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
    </View>
  );
}
