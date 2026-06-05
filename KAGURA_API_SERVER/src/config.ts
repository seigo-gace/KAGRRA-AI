import dotenv from 'dotenv';

dotenv.config();

function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function floatFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  host: process.env.HOST ?? '0.0.0.0',
  port: intFromEnv('PORT', 8787),
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  geminiFlashModel: process.env.GEMINI_FLASH_MODEL ?? 'gemini-2.5-flash',
  homuraSearchModel: process.env.HOMURA_SEARCH_MODEL ?? 'gemini-2.5-flash',
  homuraSearchProvider: process.env.HOMURA_SEARCH_PROVIDER ?? 'google_search',
  genieApiUrl: process.env.GENIE_API_URL ?? '',
  genieApiKey: process.env.GENIE_API_KEY ?? '',
  evidenceDir: process.env.KAGURA_EVIDENCE_DIR ?? './data/evidence',
  maxInputChars: intFromEnv('KAGURA_MAX_INPUT_CHARS', 24000),
  maxContextChars: intFromEnv('KAGURA_MAX_CONTEXT_CHARS', 48000),
  maxOutputTokens: intFromEnv('KAGURA_MAX_OUTPUT_TOKENS', 4096),
  temperature: floatFromEnv('KAGURA_TEMPERATURE', 0.2),
  corsOrigins: (process.env.CORS_ORIGINS ?? '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
};

export type AppConfig = typeof config;
