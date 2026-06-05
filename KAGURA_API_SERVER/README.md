# KAGURA API Server

This server is the first deployable API layer in the KAGURA roadmap.

It belongs to the Phase 1 to Phase 3 transition path:

```text
KAGURA Lite
-> Knowledge Accumulation
-> KAGURA API
```

## Purpose

The API server exists to expose a small, stable control surface while the larger core is still being designed.

It should stay small enough to move quickly, but structured enough to grow into the future KAGURA API layer.

## Current intent

- keep the API minimal
- keep routing explicit
- keep evidence visible
- keep workspace access bounded
- keep future core integration possible

## Runtime shape

```text
Gemini Flash
-> ClaudeData
-> Skill Script
-> V8 Workspace Guardrail
-> Token Compression
```

## Role layout

- `SONNET`: summary, routing, handoff, final composition
- `OPUS`: design and long-term architecture judgment
- `MYTHOS`: debug, trace, failure analysis
- `HAIKU`: development and scoped patch planning
- `HOMURA`: grounded search and KB completion

## Setup

```bash
cp .env.example .env
npm install
npm run build
npm start
```

## Docker

```bash
cp .env.example .env
docker compose up --build -d
```

## Endpoints

- `GET /health`
- `GET /v1/manifest`
- `POST /v1/kagura/route`
- `POST /v1/kagura/run`
- `POST /v1/kagura/research`
- `POST /v1/kagura/compress`

## Example

```bash
curl -s http://localhost:8787/v1/kagura/run \
  -H "Content-Type: application/json" \
  -d '{
    "message": "KAGURA Phase1のAPI設計をレビューして",
    "mode": "Design",
    "context": "Token Compressionは絶対に外さない"
  }'
```

## Roadmap link

The phase roadmap lives in `docs/roadmap/`.

- `docs/roadmap/README.md`
- `docs/roadmap/phase-0-foundation.md`
- `docs/roadmap/phase-1-kagrra-lite.md`
- `docs/roadmap/phase-2-knowledge.md`
- `docs/roadmap/phase-3-api.md`
- `docs/roadmap/phase-4-v8-workspace.md`
- `docs/roadmap/phase-5-aip.md`
- `docs/roadmap/phase-6-runtime-foundation.md`
- `docs/roadmap/phase-7-core.md`

## Notes

`HOMURA_SEARCH_PROVIDER=google_search` uses Gemini built-in Google Search grounding.
Set `HOMURA_SEARCH_PROVIDER=external_http` with `GENIE_API_URL` only when you have a separate Genie-compatible search API.
