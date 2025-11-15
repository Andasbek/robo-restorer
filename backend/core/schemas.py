# backend/core/schemas.py

from dataclasses import dataclass
from typing import Dict, Literal

EnvStatus = Literal["OK", "WARNING", "DANGER"]

@dataclass
class SensorsData:
    temperature: float
    humidity: float
    light: float
    environment_status: EnvStatus

@dataclass
class VisionResult:
    image_class: str
    confidence: float
    probabilities: Dict[str, float]

@dataclass
class DecisionResult:
    risk_level: str
    recommendation: str
