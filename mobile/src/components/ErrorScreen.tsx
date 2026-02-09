import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, ERROR_MESSAGES } from '../config/constants';
import type { WebViewError } from '../types';

interface Props {
  error?: WebViewError;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<Props> = ({ error, onRetry }) => {
  // Определить тип ошибки
  const getErrorMessage = () => {
    if (!error) return ERROR_MESSAGES.LOAD_FAILED;

    // Если код ошибки связан с сетью
    if (error.code === -1009 || error.code === -1001) {
      return ERROR_MESSAGES.SERVER_UNAVAILABLE;
    }

    return {
      title: ERROR_MESSAGES.LOAD_FAILED.title,
      message: error.description || ERROR_MESSAGES.LOAD_FAILED.message,
    };
  };

  const errorMsg = getErrorMessage();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{errorMsg.title}</Text>
      <Text style={styles.message}>{errorMsg.message}</Text>

      {error && (
        <Text style={styles.details}>
          Код ошибки: {error.code} | {error.domain}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Обновить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  details: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
