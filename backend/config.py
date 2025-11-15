# backend/config.py
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"


def _load_env_file(path: Path) -> None:
    """
    Простейший загрузчик .env:
    читает строки вида KEY=VALUE и добавляет их в os.environ,
    если переменная ещё не установлена.
    """
    if not path.exists():
        return

    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


# Загружаем .env из корня проекта (robo-restorer/.env)
_load_env_file(ENV_PATH)

# === OpenAI ===
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# === Модель ИИ (Teachable Machine SavedModel) ===
SAVEDMODEL_DIR = BASE_DIR / "data" / "models" / "tm_savedmodel"
LABELS_PATH = BASE_DIR / "data" / "models" / "labels.txt"

# Размер входного изображения
IMG_SIZE = (224, 224)
