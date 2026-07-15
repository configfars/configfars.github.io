:root {
  color-scheme: dark;

  --background: #07111f;
  --surface: rgba(14, 29, 48, 0.88);
  --surface-light: rgba(24, 45, 69, 0.75);
  --border: rgba(148, 163, 184, 0.18);
  --text: #f8fafc;
  --muted: #94a3b8;
  --primary: #38bdf8;
  --primary-dark: #0284c7;
  --success: #22c55e;
  --danger: #ef4444;
  --warning: #f59e0b;
  --unknown: #64748b;
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  margin: 0;
  color: var(--text);
  background:
    radial-gradient(
      circle at top right,
      rgba(14, 165, 233, 0.18),
      transparent 30rem
    ),
    radial-gradient(
      circle at bottom left,
      rgba(139, 92, 246, 0.14),
      transparent 28rem
    ),
    var(--background);
  font-family:
    Tahoma,
    Arial,
    sans-serif;
  line-height: 1.8;
}

button,
input {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

.hero {
  padding: 72px 20px 110px;
  text-align: center;
}

.hero__content {
  max-width: 850px;
  margin: 0 auto;
}

.hero__badge {
  display: inline-flex;
  padding: 5px 14px;
  color: #7dd3fc;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.12em;
}

.hero h1 {
  margin: 18px 0 4px;
  font-size: clamp(2.2rem, 7vw, 4.5rem);
  line-height: 1.25;
}

.hero p {
  max-width: 700px;
  margin: 14px auto 0;
  color: var(--muted);
  font-size: 1.05rem;
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: -65px auto 60px;
}

.search-panel,
.result,
.notice {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px);
}

.search-panel {
  padding: 25px;
}

.search-panel label {
  display: block;
  margin-bottom: 9px;
  font-weight: bold;
}

.search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
}

input {
  width: 100%;
  min-width: 0;
  padding: 13px 16px;
  color: var(--text);
  direction: ltr;
  text-align: left;
  background: rgba(2, 6, 23, 0.55);
  border: 1px solid var(--border);
  border-radius: 12px;
  outline: none;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.12);
}

button {
  padding: 12px 20px;
  color: #03111e;
  font-weight: bold;
  cursor: pointer;
  background: var(--primary);
  border: 0;
  border-radius: 12px;
  transition:
    transform 150ms ease,
    background 150ms ease,
    opacity 150ms ease;
}

button:hover {
  background: #7dd3fc;
  transform: translateY(-1px);
}

button:disabled {
  cursor: wait;
  opacity: 0.55;
  transform: none;
}

.secondary-button,
.copy-button {
  color: var(--text);
  background: var(--surface-light);
  border: 1px solid var(--border);
}

.secondary-button:hover,
.copy-button:hover {
  background: rgba(51, 65, 85, 0.95);
}

.input-help {
  margin: 9px 0 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.status {
  display: none;
  margin-top: 16px;
  padding: 11px 14px;
  border-radius: 10px;
}

.status.visible {
  display: block;
}

.status.loading {
  color: #bae6fd;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.25);
}

.status.success {
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.status.error {
  color: #fecaca;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.result {
  margin-top: 22px;
  padding: 26px;
}

.hidden {
  display: none !important;
}

.result-header,
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.result-header {
  margin-bottom: 22px;
}

.result-header h2,
.section-heading h2 {
  margin: 2px 0 0;
}

#result-ip {
  direction: ltr;
  text-align: right;
  overflow-wrap: anywhere;
}

.section-label {
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.copy-button {
  flex: none;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
}

.info-card {
  min-height: 105px;
  padding: 15px;
  background: var(--surface-light);
  border: 1px solid var(--border);
  border-radius: 15px;
}

.info-card__label {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 0.78rem;
}

.info-card__value {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  font-size: 0.96rem;
  font-weight: bold;
  overflow-wrap: anywhere;
}

.info-card__value.ltr {
  direction: ltr;
  justify-content: flex-end;
  text-align: left;
}

.country-flag {
  width: 28px;
  height: 20px;
  object-fit: cover;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.security-section,
.map-section,
.raw-section {
  margin-top: 34px;
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 15px;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 13px 15px;
  background: var(--surface-light);
  border: 1px solid var(--border);
  border-radius: 13px;
}

.security-value {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.77rem;
  font-weight: bold;
}

.security-value.safe {
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.14);
}

.security-value.danger {
  color: #fecaca;
  background: rgba(239, 68, 68, 0.14);
}

.security-value.unknown {
  color: #cbd5e1;
  background: rgba(100, 116, 139, 0.18);
}

.map-link {
  color: #7dd3fc;
  font-size: 0.9rem;
  text-decoration: none;
}

.map-link:hover {
  text-decoration: underline;
}

#map {
  width: 100%;
  height: 430px;
  margin-top: 15px;
  overflow: hidden;
  background: #111827;
  border: 1px solid var(--border);
  border-radius: 16px;
}

.map-notice {
  margin: 9px 0 0;
  color: var(--muted);
  font-size: 0.82rem;
}

details {
  overflow: hidden;
  background: rgba(2, 6, 23, 0.45);
  border: 1px solid var(--border);
  border-radius: 14px;
}

summary {
  padding: 13px 16px;
  cursor: pointer;
  font-weight: bold;
}

pre {
  max-height: 440px;
  margin: 0;
  padding: 16px;
  overflow: auto;
  color: #bae6fd;
  direction: ltr;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
  border-top: 1px solid var(--border);
}

.notice {
  margin-top: 22px;
  padding: 22px 25px;
}

.notice h2 {
  margin: 0 0 7px;
  font-size: 1.1rem;
}

.notice p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

footer {
  padding: 0 20px 35px;
  color: var(--muted);
  text-align: center;
  font-size: 0.82rem;
}

@media (max-width: 980px) {
  .info-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .security-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .hero {
    padding-top: 48px;
  }

  .container {
    width: min(100% - 20px, 1180px);
  }

  .search-row {
    grid-template-columns: 1fr 1fr;
  }

  .search-row input {
    grid-column: 1 / -1;
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .result-header,
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .copy-button {
    width: 100%;
  }

  #map {
    height: 350px;
  }
}

@media (max-width: 460px) {
  .search-panel,
  .result,
  .notice {
    padding: 17px;
    border-radius: 17px;
  }

  .search-row,
  .info-grid,
  .security-grid {
    grid-template-columns: 1fr;
  }

  .search-row input {
    grid-column: auto;
  }

  #map {
    height: 300px;
  }
}
