// src/App.tsx
import React, { useState, useEffect } from "react";

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

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    if (useEmulator) formData.append("use_emulator", "on");
    formData.append("lang", lang);

    try {
      setLoading(true);
      const resp = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Server Error: ${resp.status} ${text}`);
      }

      const data = (await resp.json()) as AnalyzeResult;
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to API");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="logo-block">
          <div className="logo-symbol">⚒️</div>
          <div className="logo-text">
            <h3>Robo-Restorer</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>v2.0.4 LAB</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className="status-indicator">
            <div className="status-dot"></div>
            SYSTEM ONLINE
          </div>

          <button
            className="theme-switch-btn"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="grid-layout">
        {/* LEFT CONTROL PANEL */}
        <section className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>⚙️</span> CONFIGURATION
            </div>
          </div>

          <div className="panel-content">
            <form onSubmit={handleSubmit}>
              {/* File Upload */}
              <div className="control-group">
                <label className="label-text">Target Artifact</label>
                <div
                  className={`drop-zone ${file ? 'active' : ''}`}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {file ? '📄' : '📤'}
                  </div>
                  <div style={{ color: 'var(--text-primary)' }}>
                    {file ? file.name : "Click to Upload Image"}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Supported: JPG, PNG, WEBP
                  </div>
                </div>
              </div>

              {/* Emulator Toggle */}
              <div className="control-group">
                <label className="label-text">Data Source</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={useEmulator}
                    onChange={(e) => setUseEmulator(e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <div className="toggle-track">
                    <div className="toggle-knob"></div>
                  </div>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {useEmulator ? "Emulator Mode" : "Hardware Sensors"}
                  </span>
                </label>
              </div>

              {/* Language */}
              <div className="control-group">
                <label className="label-text">Report Language</label>
                <select
                  className="input-field"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as "ru" | "en")}
                >
                  <option value="ru">Russian (RU)</option>
                  <option value="en">English (EN)</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-cyber"
                disabled={loading}
              >
                {loading ? "INITIALIZING SCAN..." : "RUN DIAGNOSTICS"}
              </button>

              {error && (
                <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.9rem' }}>
                  ⚠️ {error}
                </div>
              )}
            </form>
          </div>
        </section>

        {/* RIGHT RESULTS PANEL */}
        <section className="glass-panel" style={{ minHeight: '600px' }}>
          <div className="panel-header">
            <div className="panel-title">
              <span>📊</span> DIAGNOSTIC RESULTS
            </div>
            {result && (
              <div className={`risk-indicator risk-${result.decision.risk_level}`}>
                RISK: {result.decision.risk_level}
              </div>
            )}
          </div>

          <div className="panel-content">
            {loading ? (
              <div style={{
                height: '400px',
                display: 'flex',
                justifyComponent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '1rem',
                color: 'var(--text-secondary)'
              }}>
                <div className="status-dot" style={{ width: '12px', height: '12px' }}></div>
                <div style={{ fontFamily: 'var(--font-mono)' }}>PROCESSING ARTIFACT DATA...</div>
              </div>
            ) : !result ? (
              <div style={{
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'var(--text-dim)',
                border: '2px dashed var(--glass-border)',
                borderRadius: 'var(--radius-md)'
              }}>
                Awaiting Input...
              </div>
            ) : (
              <div className="hud-grid">

                {/* Environmental Data */}
                <div>
                  <label className="label-text">ENVIRONMENTAL SENSORS</label>
                  <div className="sensor-hud">
                    <div className="sensor-box">
                      <span className="sensor-value">{result.sensors.temperature}°C</span>
                      <span className="sensor-label">TEMP</span>
                    </div>
                    <div className="sensor-box">
                      <span className="sensor-value">{result.sensors.humidity}%</span>
                      <span className="sensor-label">HUMIDITY</span>
                    </div>
                    <div className="sensor-box">
                      <span className="sensor-value">{result.sensors.light}</span>
                      <span className="sensor-label">LUMENS</span>
                    </div>
                  </div>
                </div>

                {/* Vision Analysis */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label className="label-text">VISUAL CLASSIFICATION</label>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                      {result.vision.image_class.toUpperCase()}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <div className="bar-info">
                        <span>Confidence</span>
                        <span>{(result.vision.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: `${result.vision.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label-text">AI RECOMMENDATION</label>
                    <div className={`verdict-panel risk-${result.decision.risk_level}`}>
                      <b>Action:</b> {result.decision.recommendation}
                    </div>
                  </div>
                </div>

                {/* AI Report */}
                <div>
                  <label className="label-text">DETAILED ANALYSIS REPORT</label>
                  <div className="ai-typewriter">
                    {result.ai_report}
                  </div>
                </div>

              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
