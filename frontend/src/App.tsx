// src/App.tsx
import React, { useState } from "react";

type Sensors = {
  temperature: number;
  humidity: number;
  light: number;
  environment_status: string;
  source: "emulator" | "arduino" | string;
};

type Vision = {
  image_class_raw: string;
  image_class: string;
  confidence: number;
  probabilities: Record<string, number>;
};

type Decision = {
  risk_level: "LOW" | "MEDIUM" | "HIGH" | string;
  recommendation: string;
};

type AnalyzeResult = {
  sensors: Sensors;
  vision: Vision;
  decision: Decision;
  ai_report: string;
};

const API_URL = "http://localhost:8000/api/analyze";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [useEmulator, setUseEmulator] = useState(true);
  const [lang, setLang] = useState<"ru" | "en">("ru");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Пожалуйста, выберите файл изображения.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (useEmulator) {
      formData.append("use_emulator", "on");
    }
    formData.append("lang", lang);

    try {
      setLoading(true);
      const resp = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Ошибка сервера: ${resp.status} ${text}`);
      }

      const data = (await resp.json()) as AnalyzeResult;
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ошибка при обращении к API");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const riskBadgeClass = result ? `risk-badge risk-badge--${result.decision.risk_level}` : "risk-badge";

  const envDotClass = (status: string) => {
    if (status === "DANGER") return "badge-dot badge-dot--danger";
    if (status === "WARNING") return "badge-dot badge-dot--warning";
    return "badge-dot badge-dot--ok";
  };

  return (
    <div className="app-root">
      <main className="app-shell">
        {/* HEADER */}
        <header className="app-header">
          <div className="app-brand">
            <div className="app-title-row">
              <div className="app-title-icon">🧪</div>
              <h1 className="app-title">AI Conservator</h1>
            </div>
            <p className="app-subtitle">
              Автоматический ассистент реставратора: датчики + компьютерное
              зрение + OpenAI-отчёт для артефактов.
            </p>
          </div>
          <div className="app-badge">Robo-Restorer Lab</div>
        </header>

        {/* GRID */}
        <section className="app-grid">
          {/* LEFT: FORM */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Анализ артефакта</h2>
              <p className="card-subtitle">
                Загрузите фото и выберите режим датчиков. Система оценит
                поверхность и предложит шаги по сохранению.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Файл изображения
                  <span>(фото фрагмента артефакта)</span>
                </label>
                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Режим датчиков
                  <span>для презентации удобно оставить эмулятор</span>
                </label>
                <div className="form-checkbox-row">
                  <input
                    id="emulator"
                    type="checkbox"
                    checked={useEmulator}
                    onChange={(e) => setUseEmulator(e.target.checked)}
                  />
                  <label htmlFor="emulator">
                    Использовать эмулятор (без реального Arduino)
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Язык AI-отчёта
                  <span>резюме от OpenAI</span>
                </label>
                <select
                  className="form-select"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as "ru" | "en")}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>

              {error && (
                <div className="placeholder" style={{ borderStyle: "solid", borderColor: "rgba(248,113,113,0.5)" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !file}
              >
                {loading ? "Анализируем…" : "Запустить анализ"}
              </button>
            </form>
          </section>

          {/* RIGHT: RESULTS */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Результат анализа</h2>
              <p className="card-subtitle">
                Здесь появляются показания датчиков, вывод модели и текст
                отчёта, который можно показать жюри/экспертам.
              </p>
            </div>

            {!result && (
              <div className="placeholder">
                Загрузите изображение и нажмите{" "}
                <strong>«Запустить анализ»</strong>. После этого здесь появится
                полный отчёт: условия среды, тип повреждения и рекомендации.
              </div>
            )}

            {result && (
              <>
                {/* Блок датчиков */}
                <div className="result-section">
                  <h3>Показания датчиков</h3>
                  <p className="result-inline">
                    <span className="badge-chip">
                      <span
                        className={envDotClass(
                          result.sensors.environment_status
                        )}
                      />
                      Среда: {result.sensors.environment_status}
                    </span>{" "}
                    &nbsp; Источник:{" "}
                    <strong>
                      {result.sensors.source === "emulator"
                        ? "Эмулятор"
                        : "Arduino"}
                    </strong>
                  </p>
                  <ul className="result-list">
                    <li>
                      Температура: {result.sensors.temperature.toFixed(1)} °C
                    </li>
                    <li>
                      Влажность: {result.sensors.humidity.toFixed(1)} %
                    </li>
                    <li>Свет: {result.sensors.light.toFixed(0)}</li>
                  </ul>
                </div>

                {/* Компьютерное зрение */}
                <div className="result-section">
                  <h3>Поверхность артефакта (модель Teachable Machine)</h3>
                  <p className="result-inline">
                    Класс (raw): <code>{result.vision.image_class_raw}</code>
                    <br />
                    Класс (RU): <strong>{result.vision.image_class}</strong>
                    <br />
                    Уверенность:{" "}
                    <strong>
                      {(result.vision.confidence * 100).toFixed(1)}%
                    </strong>
                  </p>
                  <ul className="result-list">
                    {Object.entries(result.vision.probabilities).map(
                      ([cls, prob]) => (
                        <li key={cls}>
                          {cls}: {(prob * 100).toFixed(1)}%
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Решение по правилам */}
                <div className="result-section">
                  <h3>Итоговое заключение (правила)</h3>
                  <p className="result-inline">
                    <span className={riskBadgeClass}>
                      Риск: {result.decision.risk_level}
                    </span>
                  </p>
                  <p className="result-inline" style={{ marginTop: 6 }}>
                    {result.decision.recommendation}
                  </p>
                </div>

                {/* AI-отчёт OpenAI */}
                <div className="result-section">
                  <h3>AI-отчёт (OpenAI)</h3>
                  <p className="result-ai">{result.ai_report}</p>
                </div>
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export default App;
