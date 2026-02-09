export type Environment = 'development' | 'production';

export const getCurrentEnvironment = (): Environment => {
  return __DEV__ ? 'development' : 'production';
};

// ВАЖНО: Замените IP на адрес вашего компьютера в локальной сети
// Найти IP: macOS -> ipconfig getifaddr en0
// Linux -> hostname -I | awk '{print $1}'
// Windows -> ipconfig (найти IPv4)

const DEV_CONFIG = {
  FRONTEND_URL: 'http://10.0.98.229:5173',  // IP вашего компьютера
  API_URL: 'http://10.0.98.229:8000',
  ALLOWED_DOMAINS: ['localhost', '127.0.0.1', '10.0.98.229'],
};

const PROD_CONFIG = {
  FRONTEND_URL: 'https://robo-restorer.app',
  API_URL: 'https://api.robo-restorer.app',
  ALLOWED_DOMAINS: ['robo-restorer.app'],
};

const config = getCurrentEnvironment() === 'development' ? DEV_CONFIG : PROD_CONFIG;
export default config;
