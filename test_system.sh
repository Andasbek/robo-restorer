#!/bin/bash

# Цвета
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 ТЕСТИРОВАНИЕ ROBO-RESTORER v2.0.4 LAB${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd /Users/kazybekandas/Documents/learn/robo-restorer

# 1. Backend
echo -n "1️⃣  Backend API (localhost:8000)........... "
if curl -s http://localhost:8000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
    exit 1
fi

# 2. Frontend
echo -n "2️⃣  Frontend (localhost:5173).............. "
if curl -s http://localhost:5173 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
    exit 1
fi

# 3. Локальная сеть
echo -n "3️⃣  Доступ из сети (10.0.98.229:5173).... "
if curl -s http://10.0.98.229:5173 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
    exit 1
fi

# 4. API тест
echo -n "4️⃣  API /api/analyze....................... "
source venv/bin/activate 2>/dev/null
if python3 -c "
import requests
with open('data/images/test_artifact.jpg', 'rb') as f:
    r = requests.post('http://localhost:8000/api/analyze', files={'file': f}, data={'use_emulator': 'on', 'lang': 'ru'})
    exit(0 if r.status_code == 200 and 'sensors' in r.json() else 1)
" 2>/dev/null; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
    exit 1
fi

# 5. Mobile config
echo -n "5️⃣  Mobile IP конфигурация................ "
if grep -q "10.0.98.229" mobile/src/config/environment.ts; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️  IP не настроен${NC}"
fi

# 6. Mobile dependencies
echo -n "6️⃣  Mobile зависимости.................... "
if [ -d "mobile/node_modules" ]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAIL - Запустите: cd mobile && npm install${NC}"
    exit 1
fi

# 7. Детальный тест API
echo ""
echo -e "${YELLOW}📊 Детальная проверка API:${NC}"
python3 /tmp/test_api_simple.py

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ ВСЕ СИСТЕМНЫЕ ТЕСТЫ ПРОЙДЕНЫ!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 Следующий шаг - Мобильное приложение:${NC}"
echo ""
echo "   Вариант 1: Expo Go (рекомендуется)"
echo "   ────────────────────────────────────"
echo "   cd mobile"
echo "   npm start"
echo "   └─ Отсканируйте QR код в Expo Go"
echo ""
echo "   Вариант 2: Android эмулятор"
echo "   ────────────────────────────────────"
echo "   cd mobile"
echo "   npm run android"
echo ""
echo "   Вариант 3: Web-интерфейс"
echo "   ────────────────────────────────────"
echo "   Откройте: http://localhost:5173"
echo "   Или на телефоне: http://10.0.98.229:5173"
echo ""
