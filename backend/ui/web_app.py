# backend/ui/web_app.py

import tempfile
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import HTMLResponse

from backend.sensors.emulator import get_fake_sensor_data
from backend.sensors.env_status import evaluate_environment
from backend.sensors.serial_reader import SerialReader

from backend.core.schemas import SensorsData, VisionResult
from backend.ai.inference import analyze_image
from backend.core.decision_engine import decide, LABEL_MAP_RU
from backend.llm.report_generator import generate_ai_report
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="AI Conservator Web API")

# Разрешаем запросы с фронтенда (Vite по умолчанию на 5173 порту)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _read_sensors(use_emulator: bool = True) -> SensorsData:
    """
    Общая функция для чтения датчиков:
    - по умолчанию — эмулятор,
    - при необходимости — реальные показания с Arduino.
    """
    if use_emulator:
        data = get_fake_sensor_data()
    else:
        reader = SerialReader()
        reader.connect()
        data = None
        while data is None:
            data = reader.read_once()
        reader.close()

    env_status = evaluate_environment(data)

    return SensorsData(
        temperature=data["temperature"],
        humidity=data["humidity"],
        light=data["light"],
        environment_status=env_status,
    )


@app.get("/", response_class=HTMLResponse)
async def index():
    # Простой экран-заглушка, чтобы проверять, что сервер жив
    return """
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AI Conservator API</title>
      </head>
      <body>
        <h1>AI Conservator API</h1>
        <p>Бэкенд запущен. Фронтенд подключается к <code>/api/analyze</code>.</p>
      </body>
    </html>
    """


@app.post("/api/analyze")
async def api_analyze(
    file: UploadFile = File(...),
    use_emulator: str | None = Form(default="on"),  # по умолчанию эмулятор
    lang: str = Form(default="ru"),
):
    """
    JSON-API для фронтенда.
    Принимает:
      - file: изображение артефакта
      - use_emulator: "on"/None (checkbox)
      - lang: "ru" или "en"
    Возвращает JSON со всеми данными анализа.
    """
    # 1. сохраняем картинку во временный файл
    contents = await file.read()
    suffix = Path(file.filename).suffix or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(contents)
        tmp_path = Path(tmp.name)

    try:
        use_emulator_flag = use_emulator is not None

        # 2. датчики
        sensors = _read_sensors(use_emulator=use_emulator_flag)

        # 3. компьютерное зрение
        vision_raw = analyze_image(str(tmp_path))
        vision = VisionResult(
            image_class=vision_raw["image_class"],
            confidence=vision_raw["confidence"],
            probabilities=vision_raw["probabilities"],
        )
        ru_label = LABEL_MAP_RU.get(vision.image_class, vision.image_class)

        # 4. правила
        decision = decide(sensors, vision)

        # 5. AI-отчёт OpenAI
        try:
            ai_report = generate_ai_report(sensors, vision, decision, lang=lang)
        except Exception as e:
            ai_report = f"Ошибка при обращении к OpenAI: {e}"

        # 6. JSON-ответ
        return {
            "sensors": {
                "temperature": sensors.temperature,
                "humidity": sensors.humidity,
                "light": sensors.light,
                "environment_status": sensors.environment_status,
                "source": "emulator" if use_emulator_flag else "arduino",
            },
            "vision": {
                "image_class_raw": vision.image_class,
                "image_class": ru_label,
                "confidence": vision.confidence,
                "probabilities": vision.probabilities,
            },
            "decision": {
                "risk_level": decision.risk_level,
                "recommendation": decision.recommendation,
            },
            "ai_report": ai_report,
        }
    finally:
        try:
            tmp_path.unlink()
        except Exception:
            pass
