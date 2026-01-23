from fastapi.testclient import TestClient
from unittest.mock import patch
from backend.ui.web_app import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "AI Conservator API" in response.text

@patch("backend.ui.web_app.analyze_image")
@patch("backend.ui.web_app.generate_ai_report")
def test_api_analyze(mock_report, mock_analyze):
    # Mock return values
    mock_analyze.return_value = {
        "image_class": "0 corrosion",
        "probabilities": {"0 corrosion": 0.95, "1 crack": 0.05},
        "confidence": 0.95
    }
    mock_report.return_value = "Mocked AI Report"

    # Create a dummy image file
    file_content = b"fake image content"
    files = {"file": ("test.jpg", file_content, "image/jpeg")}
    
    # Test with emulator=on (default)
    response = client.post("/api/analyze", files=files, data={"use_emulator": "on", "lang": "en"})
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["vision"]["image_class_raw"] == "0 corrosion"
    assert data["ai_report"] == "Mocked AI Report"
    assert data["sensors"]["source"] == "emulator"
    
    # Verify mocks were called
    mock_analyze.assert_called_once()
    mock_report.assert_called_once()
