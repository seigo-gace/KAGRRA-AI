import type { AppConfig } from '../config.js';
import type { Citation } from '../types.js';
import { GeminiClient } from './geminiClient.js';

export interface SearchResult {
  text: string;
  citations: Citation[];
  usage?: Record<string, unknown>;
}

export class HomuraSearchClient {
  private readonly gemini: GeminiClient;

  constructor(private readonly appConfig: AppConfig) {
    this.gemini = new GeminiClient(appConfig);
  }

  async search(systemPrompt: string, userPrompt: string): Promise<SearchResult> {
    if (this.appConfig.homuraSearchProvider === 'external_http' && this.appConfig.genieApiUrl) {
      const response = await fetch(this.appConfig.genieApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.appConfig.genieApiKey ? { Authorization: `Bearer ${this.appConfig.genieApiKey}` } : {})
        },
        body: JSON.stringify({
          prompt: userPrompt,
          system: systemPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`GENIE_API_URL returned ${response.status}`);
      }

      const json = (await response.json()) as {
        text?: string;
        answer?: string;
        citations?: Citation[];
      };

      return {
        text: json.text ?? json.answer ?? JSON.stringify(json),
        citations: json.citations ?? []
      };
    }

    return this.gemini.generate({
      model: this.appConfig.homuraSearchModel,
      systemPrompt,
      userPrompt,
      useGoogleSearch: true
    });
  }
}
