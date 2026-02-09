import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, APP_VERSION } from '../config/constants';

export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>⚒️</Text>
      <Text style={styles.title}>Robo-Restorer</Text>
      <Text style={styles.version}>{APP_VERSION}</Text>
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={styles.loader}
      />
      <Text style={styles.status}>SYSTEM ONLINE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  status: {
    fontSize: 12,
    color: COLORS.primary,
    letterSpacing: 2,
  },
});
