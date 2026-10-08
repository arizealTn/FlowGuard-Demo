# FlowGuard

A polished, integrated MVP of FlowGuard — an AI-powered business operating system for small businesses.

## Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Python + FastAPI
- Data: deterministic in-memory demo dataset
- Charts: native Canvas2D (no chart framework required)
- Motion: CSS + JavaScript animation system

## Run

### 1. Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

The frontend defaults to:

`http://localhost:8001/api`

If needed, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8001/api
```

## Demo

The application uses deterministic FreshMart demo data. No random business metrics are used.

The AI Analyst is a deterministic demo service in this MVP. It returns grounded responses from the demo business data and is designed so a real LLM provider can be connected later.

## Structure

```text
flowguard/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── css/
│   │   └── app.css
│   └── js/
│       └── app.js
├── backend/
│   ├── main.py
│   └── requirements.txt
└── docs/
    └── ARCHITECTURE.md
```

## Production direction

The MVP is intentionally simple. The next production steps are:

1. PostgreSQL persistence
2. Authentication
3. Real document extraction
4. CSV/XLSX ingestion
5. Deterministic analyzers
6. LLM integration with citations
7. Background jobs
8. Object storage
9. Observability and tests
