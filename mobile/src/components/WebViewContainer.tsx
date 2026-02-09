import React, { useRef, useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { LoadingScreen } from './LoadingScreen';
import { ErrorScreen } from './ErrorScreen';
import config from '../config/environment';
import type { WebViewError } from '../types';

interface Props {
  onNavigationStateChange?: (navState: any) => void;
}

export const WebViewContainer: React.FC<Props> = ({ onNavigationStateChange }) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WebViewError | null>(null);

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);

    setError({
      domain: nativeEvent.domain || 'unknown',
      code: nativeEvent.code || -1,
      description: nativeEvent.description || 'Неизвестная ошибка',
    });
    setLoading(false);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    webViewRef.current?.reload();
  };

  // Проверка домена для безопасности
  const shouldStartLoadWithRequest = (request: any): boolean => {
    try {
      const url = new URL(request.url);
      const hostname = url.hostname;

      // Разрешить только домены из whitelist
      const isAllowed = config.ALLOWED_DOMAINS.some(domain =>
        hostname === domain || hostname.endsWith(`.${domain}`)
      );

      if (!isAllowed) {
        console.warn('Blocked navigation to:', request.url);
      }

      return isAllowed;
    } catch (e) {
      console.error('Error parsing URL:', e);
      return false;
    }
  };

  // Показать экран ошибки
  if (error) {
    return <ErrorScreen error={error} onRetry={handleRetry} />;
  }

  return (
    <>
      <WebView
        ref={webViewRef}
        source={{ uri: config.FRONTEND_URL }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
        // Для Android
        domStorageEnabled={true}
        javaScriptEnabled={true}
        // Для загрузки файлов
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        // Медиа контент
        mediaPlaybackRequiresUserAction={false}
        // Android-specific
        mixedContentMode="always" // Разрешить HTTP контент
        // iOS-specific
        allowsInlineMediaPlayback={true}
        // Кеш и производительность
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        // User Agent (опционально)
        userAgent={`RoboRestorer-Mobile/${Platform.OS}`}
      />

      {loading && <LoadingScreen />}
    </>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
});
