## 1. Общая структура проекта

```bash
ai-conservator/
├── arduino/
│   └── ai_conservator.ino        # Скетч Arduino (DHT22, LDR, светодиоды)
│
├── backend/                      # Вся логика Python
│   ├── main.py                   # Точка входа (запуск приложения)
│   ├── config.py                 # Настройки (порты, пороги, пути к модели)
│   │
│   ├── sensors/                  # Работа с датчиками (через Serial)
│   │   ├── serial_reader.py      # Чтение строк из порта
│   │   ├── parser.py             # Разбор "TEMP:..,HUM:..,LIGHT:.."
│   │   └── env_status.py         # Статус OK/WARNING/DANGER по порогам
│   │
│   ├── ai/                       # Всё про компьютерное зрение
│   │   ├── model_loader.py       # Загрузка модели (Teachable Machine / TF)
│   │   ├── inference.py          # Анализ одного изображения
│   │   └── train_notes.md        # Как обучали модель, ссылки/шаги
│   │
│   ├── core/                     # “Мозг” системы
│   │   ├── decision_engine.py    # Объединяет датчики + ИИ, выдаёт вывод
│   │   ├── schemas.py            # Pydantic/датаклассы для JSON структур
│   │   └── logger.py             # Логирование (в консоль/файл)
│   │
│   ├── ui/                       # Интерфейс пользователя
│   │   ├── cli_app.py            # Консольная версия (минимум)
│   │   └── web_app.py            # (опционально) Flask/FastAPI веб-интерфейс
│   │
│   └── api/                      # (опционально) REST API для Robo-Restorer
│       └── endpoints.py          # /status, /analyze-image, /artifact-report
│
├── data/
│   ├── images/                   # Примеры фото артефактов
│   │   ├── normal/
│   │   ├── crack/
│   │   ├── corrosion/
│   │   └── fading/
│   ├── models/                   # Сохранённые модели ИИ (.h5 / SavedModel)
│   └── samples/                  # Примеры JSON-отчётов, логов
│
├── logs/
│   ├── sensors.csv               # Лог сырых показаний (TEMP,HUM,LIGHT)
│   └── app.log                   # Лог работы приложения
│
├── docs/
│   ├── README.md                 # Описание проекта (для жюри/учителя)
│   ├── ARCHITECTURE.md           # Схема модулей, потоки данных
│   └── DEMO_SCENARIO.md          # Сценарий демонстрации на соревновании
│
├── tests/
│   ├── test_parser.py            # Тесты разбора строк с Arduino
│   ├── test_env_status.py        # Тесты логики статуса окружающей среды
│   └── test_decision_engine.py   # Тесты правил принятия решений
│
├── requirements.txt              # Зависимости Python
└── .gitignore                    # Игнор venv, __pycache__, модели, логи
```

---

## 2. Как “сшивается” логика (очень коротко)

* `backend/main.py`

  * читает конфиг (`config.py`);
  * поднимает либо `ui/cli_app.py`, либо `ui/web_app.py`;
  * инициализирует:

    * `sensors.serial_reader.SerialReader`
    * `ai.model_loader.load_model()`
    * `core.decision_engine.DecisionEngine`.

* `sensors/*`

  * получает строки с Arduino, парсит в числа, считает статус среды.

* `ai/*`

  * загружает модель, получает `image_path` → возвращает класс (`Норма/Трещина/Коррозия/Выцветание`) и вероятность.

* `core/decision_engine.py`

  * на вход: данные датчиков + результат ИИ;
  * на выход: объект (из `schemas.py`) с:

    * `environment_status`
    * `image_class`
    * `risk_level`
    * `recommendation`
    * (и JSON для Robo-Restorer).

* `ui/*`

  * отображает всё это человеку (и/или делает REST-эндпоинт).

---

## 3. С чего начать на практике

1. **Создать папки как в дереве.**
2. В `backend/config.py` прописать:

   * `SERIAL_PORT`, `BAUD_RATE`, пороги по температуре/влажности/свету;
   * пути к модели и папке с изображениями.
3. Реализовать по минимуму:

   * `serial_reader.py` + `parser.py`;
   * `env_status.py` (возвращает OK/WARNING/DANGER);
   * `model_loader.py` + `inference.py` (загрузка и один `predict`);
   * `decision_engine.py` (простые правила);
   * `ui/cli_app.py` — вывод в консоль: показания датчиков + результат ИИ.
4. Когда всё работает в консоли — при желании сделать красивый **web-интерфейс** в `ui/web_app.py`.

