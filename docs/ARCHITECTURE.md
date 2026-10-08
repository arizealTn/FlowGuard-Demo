# FlowGuard Architecture

## Product flow

Business data -> normalization -> deterministic analysis -> evidence -> insight -> recommendation -> action -> report.

## Frontend

Vanilla HTML/CSS/JavaScript.

- `index.html`: application entry point
- `css/app.css`: design system, layout, components, motion
- `js/app.js`: router, state, rendering, API client, interactions

The frontend uses hash routing so it can run as a static Vite application without a client-server rewrite configuration.

## Backend

FastAPI exposes REST endpoints under `/api`.

Current services are deterministic demo services backed by an in-memory dataset. This keeps the hackathon build stable and reproducible.

## API

- GET `/api/health`
- GET `/api/dashboard`
- GET `/api/insights`
- GET `/api/insights/{id}`
- GET `/api/documents`
- POST `/api/documents/upload`
- GET `/api/data/{kind}`
- GET `/api/actions`
- POST `/api/actions`
- GET `/api/reports`
- POST `/api/analyst/query`
- GET `/api/settings`

## Motion

Motion is centralized through:

- CSS keyframes and transitions
- `motion` helper functions in `app.js`
- `prefers-reduced-motion`

Motion communicates hierarchy, state, change, and feedback. It is not used as decoration everywhere.

## Data

The MVP uses a deterministic FreshMart dataset. Replace the repository-level demo data with PostgreSQL and service modules later.

## Security note

This MVP is not production-ready authentication or authorization software. Do not deploy it publicly with sensitive business data without adding authentication, authorization, validation, rate limits, secure file handling, and persistent storage.
