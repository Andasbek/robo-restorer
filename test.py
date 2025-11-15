from pathlib import Path
from backend.ai.inference import analyze_image

if __name__ == "__main__":
    img_path = Path("data/images/test_artifact.jpg")  # убедись, что файл существует
    print("Проверяю модель на:", img_path)

    result = analyze_image(str(img_path))
    print("Результат анализа:")
    print(result)
