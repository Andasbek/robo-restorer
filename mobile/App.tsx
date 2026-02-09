import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { MainScreen } from './src/screens/MainScreen';
import { TIMEOUTS } from './src/config/constants';

// Предотвратить автоматическое скрытие splash screen
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Здесь можно загрузить шрифты, данные и т.д.
        // Для MVP просто ждем минимальное время
        await new Promise(resolve => setTimeout(resolve, TIMEOUTS.SPLASH_DURATION));
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <MainScreen />
    </View>
  );
}
