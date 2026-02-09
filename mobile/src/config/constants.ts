export const APP_VERSION = '2.0.4 LAB';

export const COLORS = {
  background: '#0a0e27',
  primary: '#00d9ff',
  danger: '#ff4757',
  success: '#2ed573',
  text: '#ffffff',
  textSecondary: '#a4a8c1',
};

export const TIMEOUTS = {
  SPLASH_DURATION: 2000,
  NETWORK_CHECK_INTERVAL: 5000,
};

export const ERROR_MESSAGES = {
  NO_INTERNET: {
    title: 'Нет подключения к интернету',
    message: 'Проверьте ваше подключение и попробуйте снова',
  },
  LOAD_FAILED: {
    title: 'Ошибка загрузки',
    message: 'Не удалось загрузить приложение. Потяните вниз для обновления.',
  },
  SERVER_UNAVAILABLE: {
    title: 'Сервер недоступен',
    message: 'Убедитесь, что backend и frontend запущены на вашем компьютере.',
  },
};
