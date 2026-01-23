# backend/llm/report_generator.py

from textwrap import dedent
from backend.llm.openai_client import get_client
from backend.core.schemas import SensorsData, VisionResult, DecisionResult


def generate_ai_report(
    sensors: SensorsData,
    vision: VisionResult,
    decision: DecisionResult,
    lang: str = "ru",
) -> str:
    """
    Просим OpenAI сделать человеко-понятный отчёт по артефакту.
    """
    client = get_client()

    if lang == "ru":
        prompt_lang = "Напиши отчёт на русском языке."
    else:
        prompt_lang = "Write the report in English."

    prompt = dedent(f"""
    Ты — эксперт по реставрации археологических артефактов.

    Данные датчиков:
    - Температура: {sensors.temperature:.1f} °C
    - Влажность: {sensors.humidity:.1f} %
    - Свет: {sensors.light:.0f}
    - Статус среды: {sensors.environment_status}

    Результат компьютерного зрения:
    - Класс поверхности: {vision.image_class}
    - Уверенность модели: {vision.confidence:.2f}
    - Вероятности по классам: {vision.probabilities}

    Итоговое правило-based заключение системы:
    - Уровень риска: {decision.risk_level}
    - Рекомендация: {decision.recommendation}

    {prompt_lang}

    Структура ответа:
    1. Краткий вывод (1–2 предложения).
    2. Объясни, что значит такой класс поверхности (для не специалиста).
    3. Оцени условия хранения по датчикам.
    4. Дай 3–5 конкретных рекомендаций, что делать дальше (маркируй пунктами).
    Пиши компактно, но понятно.
    """)

    response = client.responses.create(
        model="gpt-4o",  # или gpt-4o-mini / что у тебя есть
        input=prompt,
    )

    text = response.output[0].content[0].text
    return text
