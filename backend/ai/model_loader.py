# backend/ai/model_loader.py

from typing import Any
import tensorflow as tf
from backend import config

_model_cache: Any = None

def get_model():
    """
    Загружает SavedModel один раз и кэширует.
    """
    global _model_cache
    if _model_cache is None:
        _model_cache = tf.saved_model.load(str(config.SAVEDMODEL_DIR))
    return _model_cache
