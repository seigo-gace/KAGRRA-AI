import { GoogleGenAI } from '@google/genai';
import type { Citation } from '../types.js';
import type { AppConfig } from '../config.js';
import { ApiError } from '../utils/errors.js';

export interface GenerateOptions {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  useGoogleSearch?: boolean;
}

export interface GenerateResult {
  text: string;
  citations: Citation[];
  usage?: Record<string, unknown>;
}

function extractCitations(response: unknown): Citation[] {
  const candidate = (response as { candidates?: Array<Record<string, unknown>> }).candidates?.[0];
  const groundingMetadata = candidate?.groundingMetadata as
    | {
        groundingChunks?: Array<{ web?: { title?: string; uri?: string } }>;
      }
    | undefined;

  return (
    groundingMetadata?.groundingChunks
      ?.map((chunk) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri,
        source: 'google_search'
      }))
      .filter((citation) => citation.uri) ?? []
  );
}

export class GeminiClient {
  private readonly ai: GoogleGenAI;

  constructor(private readonly appConfig: AppConfig) {
    if (!appConfig.geminiApiKey) {
      throw new ApiError(500, 'GEMINI_API_KEY is required.');
    }
    this.ai = new GoogleGenAI({ apiKey: appConfig.geminiApiKey });
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const config: Record<string, unknown> = {
      temperature: this.appConfig.temperature,
      maxOutputTokens: this.appConfig.maxOutputTokens,
      responseMimeType: 'application/json',
      systemInstruction: options.systemPrompt
    };

    if (options.useGoogleSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await this.ai.models.generateContent({
      model: options.model,
      contents: options.userPrompt,
      config
    });

    return {
      text: response.text ?? '',
      citations: extractCitations(response),
      usage: (response as { usageMetadata?: Record<string, unknown> }).usageMetadata
    };
  }
}
