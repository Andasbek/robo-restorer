# backend/sensors/emulator.py

import random
from typing import Dict

def get_fake_sensor_data() -> Dict[str, float]:
    """
    Возвращает "похожий на правду" набор показаний.
    Можно менять диапазоны под сценарий.
    """
    temp = random.uniform(20.0, 32.0)     # °C
    hum = random.uniform(40.0, 80.0)      # %
    light = random.uniform(300, 900)      # условные единицы LDR

    return {
        "temperature": temp,
        "humidity": hum,
        "light": light,
    }
