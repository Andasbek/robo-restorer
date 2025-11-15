# backend/core/decision_engine.py

from backend.core.schemas import SensorsData, VisionResult, DecisionResult

LABEL_MAP_RU = {
    "0 corrosion": "Коррозия",
    "1 crack": "Трещина",
    "2 fading": "Выцветание",
    "3 normal": "Норма",
}

def decide(sensors: SensorsData, vision: VisionResult) -> DecisionResult:
    img_cls_raw = vision.image_class               # то, что пришло из модели: "0 corrosion"
    img_cls = LABEL_MAP_RU.get(img_cls_raw, img_cls_raw)  # "Коррозия", "Трещина" и т.д.
    env = sensors.environment_status

    # Очень простые правила, можешь расширять
    if img_cls == "Коррозия" and env == "DANGER":
        return DecisionResult(
            risk_level="HIGH",
            recommendation=(
                "Обнаружена коррозия и неблагоприятные условия. "
                "Требуется стабилизация среды и консультация реставратора."
            ),
        )

    if img_cls == "Коррозия":
        return DecisionResult(
            risk_level="MEDIUM",
            recommendation=(
                "Обнаружена коррозия. Рекомендуется улучшить условия хранения "
                "и рассмотреть возможность щадящей очистки."
            ),
        )

    if img_cls == "Трещина":
        return DecisionResult(
            risk_level="MEDIUM",
            recommendation=(
                "Обнаружены трещины. Ограничьте механические воздействия "
                "и оцените необходимость реставрации."
            ),
        )

    if img_cls == "Выцветание":
        return DecisionResult(
            risk_level="MEDIUM",
            recommendation=(
                "Обнаружены признаки выцветания. Проверьте уровень освещённости "
                "и уменьшите световую нагрузку."
            ),
        )

    # Норма
    if env == "OK":
        return DecisionResult(
            risk_level="LOW",
            recommendation="Поверхность артефакта в норме, условия хранения приемлемые.",
        )
    else:
        return DecisionResult(
            risk_level="LOW",
            recommendation="Поверхность артефакта пока в норме, но улучшите условия хранения.",
        )
