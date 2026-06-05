# KAGURA API Server File Tree

```text
KAGURA_API_SERVER/
├─ .dockerignore
├─ .env.example
├─ .gitignore
├─ DEPLOYMENT.md
├─ Dockerfile
├─ FILE_TREE.md
├─ README.md
├─ docker-compose.yml
├─ package.json
├─ tsconfig.json
├─ data/
│  └─ evidence/
│     └─ .gitkeep
└─ src/
   ├─ app.ts
   ├─ config.ts
   ├─ index.ts
   ├─ types.ts
   ├─ validation.ts
   ├─ agents/
   │  ├─ outputSpec.ts
   │  ├─ profiles.ts
   │  ├─ promptBuilder.ts
   │  └─ router.ts
   ├─ clients/
   │  ├─ geminiClient.ts
   │  └─ homuraSearchClient.ts
   ├─ routes/
   │  ├─ health.ts
   │  └─ kagura.ts
   ├─ services/
   │  ├─ compression.ts
   │  ├─ evidenceLedger.ts
   │  ├─ kaguraService.ts
   │  ├─ modelJson.ts
   │  └─ security.ts
   └─ utils/
      ├─ errors.ts
      └─ ids.ts
```

## Ownership

- `src/agents`: 5-agent definitions, routing, prompt and output contracts.
- `src/clients`: Gemini Flash and HOMURA search provider clients.
- `src/services`: KAGURA orchestration, token compression, evidence, guardrails.
- `src/routes`: HTTP API endpoints.
- `data/evidence`: append-only runtime evidence ledger storage.
