# backend/ai/inference.py

from typing import Dict, List

import cv2
import numpy as np
import tensorflow as tf

from backend import config
from backend.ai.model_loader import get_model


def load_labels() -> List[str]:
    labels = []
    with open(config.LABELS_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                labels.append(line)
    return labels


def preprocess_image(image_path: str) -> np.ndarray:
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Не удалось открыть изображение: {image_path}")

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, config.IMG_SIZE)

    # Нормализация как в Teachable Machine: [-1, 1]
    img = img.astype("float32") / 127.5 - 1.0

    # (1, H, W, C)
    return np.expand_dims(img, axis=0)


def analyze_image(image_path: str) -> Dict:
    """
    Возвращает:
      {
        "image_class": "...",
        "probabilities": {...},
        "confidence": 0.87
      }
    """
    model = get_model()
    labels = load_labels()
    inp = preprocess_image(image_path)

    # Берём основную сигнатуру SavedModel
    infer = model.signatures["serving_default"]

    # Узнаём имя входного тензора (TM сам его задаёт)
    input_keys = list(infer.structured_input_signature[1].keys())
    input_name = input_keys[0]  # сейчас не используем явно, но можно сохранить

    outputs = infer(tf.constant(inp, dtype=tf.float32))
    preds = list(outputs.values())[0].numpy()[0]

    probs = {cls: float(p) for cls, p in zip(labels, preds)}
    max_idx = int(np.argmax(preds))
    image_class = labels[max_idx]
    confidence = float(preds[max_idx])

    return {
        "image_class": image_class,
        "probabilities": probs,
        "confidence": confidence,
    }
