from backend.core.decision_engine import decide
from backend.core.schemas import SensorsData, VisionResult

def test_decide_corrosion_danger():
    sensors = SensorsData(
        temperature=35.0, humidity=80.0, light=900.0, environment_status="DANGER"
    )
    vision = VisionResult(
        image_class="0 corrosion", probabilities={"0 corrosion": 0.9}, confidence=0.9
    )
    result = decide(sensors, vision)
    assert result.risk_level == "HIGH"
    assert "Обнаружена коррозия" in result.recommendation

def test_decide_corrosion_medium():
    sensors = SensorsData(
        temperature=22.0, humidity=45.0, light=300.0, environment_status="OK"
    )
    vision = VisionResult(
        image_class="0 corrosion", probabilities={"0 corrosion": 0.9}, confidence=0.9
    )
    result = decide(sensors, vision)
    assert result.risk_level == "MEDIUM"
    assert "Обнаружена коррозия" in result.recommendation

def test_decide_crack():
    sensors = SensorsData(
        temperature=22.0, humidity=45.0, light=300.0, environment_status="OK"
    )
    vision = VisionResult(
        image_class="1 crack", probabilities={"1 crack": 0.9}, confidence=0.9
    )
    result = decide(sensors, vision)
    assert result.risk_level == "MEDIUM"
    assert "Обнаружены трещины" in result.recommendation

def test_decide_normal_ok():
    sensors = SensorsData(
        temperature=22.0, humidity=45.0, light=300.0, environment_status="OK"
    )
    vision = VisionResult(
        image_class="3 normal", probabilities={"3 normal": 0.9}, confidence=0.9
    )
    result = decide(sensors, vision)
    assert result.risk_level == "LOW"
    assert "в норме" in result.recommendation

def test_decide_normal_bad_env():
    sensors = SensorsData(
        temperature=35.0, humidity=80.0, light=900.0, environment_status="DANGER"
    )
    vision = VisionResult(
        image_class="3 normal", probabilities={"3 normal": 0.9}, confidence=0.9
    )
    result = decide(sensors, vision)
    assert result.risk_level == "LOW"
    assert "улучшите условия" in result.recommendation
