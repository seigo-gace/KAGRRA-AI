# VPS Deployment

Before deployment, confirm the root checklist:

- `docs/operations/kagrra-charter.md`
- `docs/operations/deployment-checklist.md`

## 1. Upload

Place this directory on the VPS:

```bash
scp -r KAGURA_API_SERVER user@your-vps:/opt/kagura-api
```

## 2. Configure

```bash
cd /opt/kagura-api
cp .env.example .env
nano .env
```

Required:

```bash
GEMINI_API_KEY=your_google_ai_api_key
```

Default search mode:

```bash
HOMURA_SEARCH_PROVIDER=google_search
```

Use a separate Genie-compatible HTTP API only when it exists:

```bash
HOMURA_SEARCH_PROVIDER=external_http
GENIE_API_URL=https://example.com/search
GENIE_API_KEY=your_key
```

## 3. Run With Docker Compose

```bash
docker compose up --build -d
docker compose logs -f
```

Health check:

```bash
curl http://127.0.0.1:8787/health
```

## 4. Run Without Docker

```bash
npm install
npm run build
npm start
```

## 5. Smoke Tests

Route only:

```bash
curl -s http://127.0.0.1:8787/v1/kagura/route \
  -H "Content-Type: application/json" \
  -d '{"message":"APIサーバーのデプロイ設計をして"}'
```

Gemini Flash run:

```bash
curl -s http://127.0.0.1:8787/v1/kagura/run \
  -H "Content-Type: application/json" \
  -d '{"mode":"Design","message":"KAGURA APIのVPS運用設計を短くまとめて"}'
```

HOMURA search:

```bash
curl -s http://127.0.0.1:8787/v1/kagura/research \
  -H "Content-Type: application/json" \
  -d '{"message":"Gemini APIのGoogle Search groundingの使い方を調べて"}'
```

Evidence:

```bash
curl -s http://127.0.0.1:8787/v1/kagura/evidence
```
