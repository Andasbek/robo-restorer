# backend/ui/cli_app.py

from pathlib import Path

from backend.sensors.serial_reader import SerialReader
from backend.sensors.env_status import evaluate_environment
from backend.core.schemas import SensorsData
from backend.ai.inference import analyze_image
from backend.core.decision_engine import decide


def run_cli(image_path: str):
    image_path = Path(image_path)
    if not image_path.exists():
        raise FileNotFoundError(f"Файл не найден: {image_path}")

    # 1. Читаем один набор данных с Arduino
    reader = SerialReader()
    print("Подключаюсь к Arduino...")
    reader.connect()
    print("Читаю данные датчиков...")
    data = None
    while data is None:
        data = reader.read_once()
    reader.close()

    env_status = evaluate_environment(data)
    sensors = SensorsData(
        temperature=data["temperature"],
        humidity=data["humidity"],
        light=data["light"],
        environment_status=env_status,
    )

    print(f"- Температура: {sensors.temperature:.1f} °C")
    print(f"- Влажность: {sensors.humidity:.1f} %")
    print(f"- Свет: {sensors.light:.0f}")
    print(f"- Статус среды: {sensors.environment_status}")

    # 2. Анализ фото
    print("\nАнализ изображения артефакта...")
    vision_raw = analyze_image(str(image_path))

    from backend.core.schemas import VisionResult
    vision = VisionResult(
        image_class=vision_raw["image_class"],
        confidence=vision_raw["confidence"],
        probabilities=vision_raw["probabilities"],
    )

    print(f"- Класс: {vision.image_class} (уверенность {vision.confidence:.2f})")

    # 3. Объединённое решение
    decision = decide(sensors, vision)

    print("\n=== Итоговое заключение ===")
    print(f"Уровень риска: {decision.risk_level}")
    print(f"Рекомендация: {decision.recommendation}")
