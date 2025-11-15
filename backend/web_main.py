# backend/web_main.py

import uvicorn
from backend.ui.web_app import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
