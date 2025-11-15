# backend/ui/cli_app.py

from pathlib import Path

from backend.sensors.serial_reader import SerialReader
from backend.sensors.env_status import evaluate_environment
from backend.sensors.emulator import get_fake_sensor_data

from backend.core.schemas import SensorsData, VisionResult
from backend.ai.inference import analyze_image
from backend.core.decision_engine import decide, LABEL_MAP_RU
from backend.llm.report_generator import generate_ai_report


def read_sensors(use_emulator: bool = False) -> SensorsData:
    """
    Читает данные датчиков:
    - из эмулятора (по умолчанию для демо),
    - или с реального Arduino, если use_emulator=False.
    """
    if use_emulator:
        data = get_fake_sensor_data()
    else:
        reader = SerialReader()
        print("Подключаюсь к Arduino...")
        reader.connect()
        print("Читаю данные датчиков...")
        data = None
        # читаем до первой валидной строки
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


def run_cli(image_path: str, use_emulator: bool = True, lang: str = "ru") -> None:
    """
    Основной сценарий CLI:
    1) чтение датчиков;
    2) анализ изображения ИИ-моделью;
    3) вывод rule-based заключения;
    4) генерация AI-отчёта через OpenAI.
    """
    img_path = Path(image_path)
    if not img_path.exists():
        raise FileNotFoundError(f"Файл не найден: {img_path}")

    print("=== AI Conservator — консольная демо-версия ===")
    print(f"Изображение артефакта: {img_path}")
    print(f"Источник датчиков: {'Эмулятор' if use_emulator else 'Arduino'}")

    # 1. Датчики
    sensors = read_sensors(use_emulator=use_emulator)

    print("\n--- Показания датчиков ---")
    print(f"- Температура: {sensors.temperature:.1f} °C")
    print(f"- Влажность:   {sensors.humidity:.1f} %")
    print(f"- Свет:        {sensors.light:.0f}")
    print(f"- Статус среды: {sensors.environment_status}")

    # 2. Анализ изображения
    print("\n--- Анализ изображения (Teachable Machine) ---")
    vision_raw = analyze_image(str(img_path))
    vision = VisionResult(
        image_class=vision_raw["image_class"],
        confidence=vision_raw["confidence"],
        probabilities=vision_raw["probabilities"],
    )

    ru_label = LABEL_MAP_RU.get(vision.image_class, vision.image_class)

    print(f"- Класс модели (raw): {vision.image_class}")
    print(f"- Класс (RU):         {ru_label}")
    print(f"- Уверенность:        {vision.confidence:.2f}")
    print("- Вероятности по классам:")
    for cls, prob in vision.probabilities.items():
        print(f"  * {cls}: {prob:.2f}")

    # 3. Правил-based решение
    decision = decide(sensors, vision)

    print("\n=== Итоговое заключение (правила) ===")
    print(f"Уровень риска: {decision.risk_level}")
    print(f"Рекомендация:  {decision.recommendation}")

    # 4. AI-отчёт от OpenAI (если ключ есть)
    print("\n=== AI-отчёт (OpenAI) ===")
    try:
        report = generate_ai_report(sensors, vision, decision, lang=lang)
        print(report)
    except Exception as e:
        print("Не удалось получить отчёт от OpenAI:", e)
