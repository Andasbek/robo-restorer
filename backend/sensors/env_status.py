# backend/sensors/env_status.py

from typing import Dict

def evaluate_environment(data: Dict[str, float]) -> str:
    """
    Очень простая логика оценки среды хранения.

    data: словарь вида:
      {
        "temperature": float,
        "humidity": float,
        "light": float,
      }

    Возвращает:
      - "DANGER"  — условия плохие, нужен контроль
      - "WARNING" — на грани нормы
      - "OK"      — всё в пределах допустимого
    """

    temp = data.get("temperature", 0.0)
    hum = data.get("humidity", 0.0)
    light = data.get("light", 0.0)

    # Пример порогов для музея/хранения артефактов
    # Можно потом подстроить "по-научному", если нужно.
    TEMP_DANGER = 30.0
    TEMP_WARN = 25.0

    HUM_DANGER = 70.0
    HUM_WARN = 60.0

    LIGHT_DANGER = 800.0
    LIGHT_WARN = 500.0

    # Опасные условия
    if (
        temp >= TEMP_DANGER
        or hum >= HUM_DANGER
        or light >= LIGHT_DANGER
    ):
        return "DANGER"

    # Предупреждение
    if (
        temp >= TEMP_WARN
        or hum >= HUM_WARN
        or light >= LIGHT_WARN
    ):
        return "WARNING"

    # Всё ок
    return "OK"
