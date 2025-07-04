import HomeScreen from '@/src/Screens/HomeScreen';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const loadFonts = async () => {
    await Font.loadAsync({
      'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
      'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    });
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
