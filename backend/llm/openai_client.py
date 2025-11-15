# backend/llm/openai_client.py
import os
from openai import OpenAI
from backend import config

def get_client() -> OpenAI:
    api_key = config.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY не найден ни в .env, ни в окружении")
    return OpenAI(api_key=api_key)
