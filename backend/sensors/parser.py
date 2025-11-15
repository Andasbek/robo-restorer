# backend/sensors/parser.py

from typing import Optional, Dict

def parse_sensor_line(line: str) -> Optional[Dict[str, float]]:
    """
    Ожидаемый формат:
    TEMP:23.4,HUM:45.6,LIGHT:512
    """
    try:
        line = line.strip()
        parts = line.split(",")
        data = {}
        for part in parts:
            key, value = part.split(":")
            data[key.strip().upper()] = float(value.strip())
        return {
            "temperature": data.get("TEMP"),
            "humidity": data.get("HUM"),
            "light": data.get("LIGHT"),
        }
    except Exception:
        return None
