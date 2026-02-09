# Robo-Restorer Mobile

Мобильное приложение для Robo-Restorer (Android MVP) на базе React Native + Expo WebView.

## Версия
v2.0.4 LAB

## Требования

- Node.js 18+
- npm или yarn
- Expo CLI
- Android Studio (для эмулятора) или физическое Android устройство
- Backend и Frontend запущены на компьютере в локальной сети

## Установка

```bash
# Из папки mobile/
npm install

# Установить Expo CLI глобально (если еще не установлен)
npm install -g expo-cli
```

## Настройка

### 1. Узнать IP компьютера

**macOS:**
```bash
ipconfig getifaddr en0
# или
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Linux:**
```bash
hostname -I | awk '{print $1}'
```

**Windows:**
```cmd
ipconfig
# Найти IPv4 адрес
```

### 2. Обновить конфигурацию

Отредактировать файл `src/config/environment.ts`:
```typescript
const DEV_CONFIG = {
  FRONTEND_URL: 'http://ВАШ_IP:5173',  // Замените ВАШ_IP
  API_URL: 'http://ВАШ_IP:8000',
  ALLOWED_DOMAINS: [
    'localhost',
    '127.0.0.1',
    'ВАШ_IP',  // Замените ВАШ_IP
  ],
};
```

### 3. Настроить frontend для локальной сети

В файле `frontend/vite.config.ts` уже должно быть:
```typescript
server: {
  host: '0.0.0.0',
  port: 5173,
}
```

### 4. Обновить CORS в backend

В файле `backend/ui/web_app.py` должен быть разрешен доступ из локальной сети.

## Запуск

### 1. Запустить Backend и Frontend

На компьютере:
```bash
# Из корня robo-restorer/
./run.sh
```

Проверить доступность:
- Frontend: http://ВАШ_IP:5173
- Backend API: http://ВАШ_IP:8000

### 2. Запустить мобильное приложение

```bash
# Из папки mobile/
npm start

# Или для прямого запуска на Android
npm run android
```

### 3. Подключить устройство

**Вариант A: Android эмулятор**
- Открыть Android Studio
- Запустить AVD (Android Virtual Device)
- В Expo CLI нажать 'a' для запуска на Android

**Вариант B: Физическое устройство**
- Включить "Режим разработчика" на Android
- Включить "Отладка по USB"
- Подключить через USB или использовать Expo Go
- Убедиться, что устройство в той же WiFi сети, что и компьютер

**Вариант C: Expo Go (простейший способ)**
```bash
npm start
# Отсканировать QR код в приложении Expo Go
```

## Структура проекта

```
mobile/
├── src/
│   ├── components/        # React компоненты
│   │   ├── WebViewContainer.tsx
│   │   ├── OfflineScreen.tsx
│   │   ├── ErrorScreen.tsx
│   │   └── LoadingScreen.tsx
│   ├── screens/           # Экраны
│   │   └── MainScreen.tsx
│   ├── config/            # Конфигурация
│   │   ├── constants.ts
│   │   └── environment.ts
│   ├── utils/             # Утилиты
│   │   └── network.ts
│   └── types/             # TypeScript типы
│       └── index.ts
├── assets/                # Иконки и изображения
├── App.tsx                # Главный компонент
├── app.json               # Expo конфигурация
└── package.json
```

## Возможности

- ✅ WebView с локальным frontend
- ✅ Обработка offline режима
- ✅ Обработка ошибок загрузки
- ✅ Pull-to-refresh (через WebView)
- ✅ Обработка кнопки Back на Android
- ✅ Ограничение доменов (безопасность)
- ✅ Разрешения для файлов/камеры
- ✅ Splash screen
- ✅ Конфигурация DEV/PROD

## Создание ассетов (иконки и splash screen)

### Важно!
Приложение использует стандартные ассеты Expo. Для полноценной кастомизации создайте:

**Необходимые файлы:**
- `assets/icon.png` (1024x1024px) - Иконка приложения
- `assets/adaptive-icon.png` (1024x1024px) - Адаптивная иконка для Android
- `assets/splash-icon.png` (1284x2778px) - Splash screen
- `assets/favicon.png` (48x48px) - Favicon для web

**Дизайн:**
- Фон: `#0a0e27` (темно-синий из дизайна Robo-Restorer)
- Логотип: ⚒️ emoji или векторная версия
- Цвет акцента: `#00d9ff` (голубой)

**Инструменты для создания:**
1. https://icon.kitchen/ - автогенератор иконок
2. https://www.appicon.co/ - генератор из SVG/PNG
3. Figma/Photoshop - ручная разработка

**Быстрый способ:**
```bash
# Использовать Expo инструменты для генерации
npx expo customize:prebuild
```

## Сборка APK

```bash
# Установить EAS CLI
npm install -g eas-cli

# Логин в Expo
eas login

# Настроить проект
eas build:configure

# Собрать APK для локального тестирования
npm run build:apk
```

Создать файл `eas.json`:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Команды сборки:
```bash
# Локальная сборка (быстрее, требует Android SDK)
eas build --platform android --profile preview --local

# Облачная сборка (проще)
eas build --platform android --profile preview
```

## Устранение неполадок

### Не загружается WebView
- Проверить, что backend и frontend запущены
- Проверить IP адрес в `environment.ts`
- Убедиться, что устройство в той же WiFi сети

### Ошибка "usesCleartextTraffic"
- Уже настроено в `app.json`
- Для Android 9+ HTTP требует явного разрешения

### Камера/Файлы не работают
- Проверить разрешения в `app.json`
- На физическом устройстве разрешить доступ в настройках

### Expo Go не подключается
- Использовать `npm run tunnel` для туннелирования
- Или собрать standalone APK

### Ошибки при запуске
```bash
# Очистить кеш
npm start -- --clear

# Переустановить зависимости
rm -rf node_modules
npm install
```

## Отладка

### Chrome DevTools для Android
1. Запустить приложение на физическом устройстве: `npm run android`
2. В Chrome открыть: `chrome://inspect/#devices`
3. Выбрать WebView для инспекции

### Логи Expo
```bash
# Показать все логи
npx expo start --clear

# Только ошибки
npx expo start --no-dev
```

## Команды разработки

```bash
# Запуск dev сервера
npm start

# Запуск на Android эмуляторе/устройстве
npm run android

# Запуск на iOS (требует Mac)
npm run ios

# Запуск в web браузере
npm run web

# Запуск с туннелем (для доступа из внешней сети)
npm run tunnel
```

## Следующие шаги

1. **Создайте ассеты** - замените стандартные иконки и splash screen
2. **Обновите IP** - замените `192.168.1.100` на ваш локальный IP в `src/config/environment.ts`
3. **Протестируйте** - проверьте все функции на эмуляторе или реальном устройстве
4. **Соберите APK** - создайте установочный файл для распространения

## Продакшн деплой (будущее)

Когда будете готовы к продакшн:

1. Развернуть backend и frontend на сервер с HTTPS
2. Обновить `PROD_CONFIG` в `src/config/environment.ts`
3. Собрать production build через EAS
4. Опубликовать в Google Play Store

## Лицензия
Образовательный проект

## Автор
Andasbek

## Ссылки
- [Expo Documentation](https://docs.expo.dev/)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [Основной проект Robo-Restorer](../README.md)
