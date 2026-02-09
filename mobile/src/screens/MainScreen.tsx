import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebViewContainer } from '../components/WebViewContainer';
import { OfflineScreen } from '../components/OfflineScreen';
import { checkNetworkConnection, subscribeToNetworkChanges } from '../utils/network';
import type { NavigationState } from '../types';

export const MainScreen: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  // Проверка сети при монтировании
  useEffect(() => {
    checkNetworkConnection().then(setIsConnected);

    // Подписка на изменения сети
    const unsubscribe = subscribeToNetworkChanges(setIsConnected);

    return () => {
      unsubscribe();
    };
  }, []);

  // Обработка кнопки Back на Android
  useEffect(() => {
    const backAction = () => {
      if (canGoBack) {
        // WebView может вернуться назад
        // Будет обработано в WebViewContainer через ref
        return true;
      } else {
        // Показать диалог выхода
        Alert.alert(
          'Выход',
          'Вы действительно хотите выйти из приложения?',
          [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Выйти', onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleNavigationStateChange = useCallback((navState: NavigationState) => {
    setCanGoBack(navState.canGoBack);
  }, []);

  const handleRetry = () => {
    checkNetworkConnection().then(setIsConnected);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {isConnected ? (
        <WebViewContainer onNavigationStateChange={handleNavigationStateChange} />
      ) : (
        <OfflineScreen onRetry={handleRetry} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
});
