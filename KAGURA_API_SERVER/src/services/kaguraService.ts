import type { AppConfig } from '../config.js';
import type { KaguraRequest, KaguraResponse, RouteDecision } from '../types.js';
import { agentProfiles } from '../agents/profiles.js';
import { routeRequest } from '../agents/router.js';
import { buildSystemPrompt, buildUserPrompt } from '../agents/promptBuilder.js';
import { compressText } from './compression.js';
import { parseModelJson, sectionsToMarkdown } from './modelJson.js';
import { GeminiClient } from '../clients/geminiClient.js';
import { HomuraSearchClient } from '../clients/homuraSearchClient.js';
import { EvidenceLedger } from './evidenceLedger.js';
import { validateInboundText } from './security.js';
import { createId } from '../utils/ids.js';

export class KaguraService {
  private readonly gemini: GeminiClient;
  private readonly homura: HomuraSearchClient;
  private readonly ledger: EvidenceLedger;

  constructor(private readonly appConfig: AppConfig) {
    this.gemini = new GeminiClient(appConfig);
    this.homura = new HomuraSearchClient(appConfig);
    this.ledger = new EvidenceLedger(appConfig.evidenceDir);
  }

  manifest(): Record<string, unknown> {
    return {
      name: 'KAGURA Phase1 API Server',
      version: '1.0.0',
      definition:
        'KAGURA transforms Gemini Flash into long-lived development intelligence with ClaudeData, Skill Script, V8 Workspace guardrails, and Token Compression.',
      agents: agentProfiles,
      routes: {
        Normal: 'HIBIKI / SONNET',
        Handoff: 'HIBIKI / SONNET',
        Design: 'SUBARU / OPUS',
        Research: 'HOMURA / SEARCH',
        Debug: 'KANAME / MYTHOS',
        Development: 'HAYATE / HAIKU'
      }
    };
  }

  route(request: KaguraRequest): RouteDecision {
    validateInboundText(request.message, this.appConfig.maxInputChars);
    return routeRequest(request.message, request.mode);
  }

  async run(request: KaguraRequest): Promise<KaguraResponse> {
    validateInboundText(request.message, this.appConfig.maxInputChars);
    if (request.context) {
      validateInboundText(request.context, this.appConfig.maxContextChars);
    }

    const requestId = request.requestId ?? createId('req');
    const sessionId = request.sessionId ?? createId('session');
    const route = this.route(request);
    const profile = agentProfiles[route.agent];
    const compressedContext = compressText(request.context ?? '', Math.min(8000, this.appConfig.maxContextChars));
    const systemPrompt = buildSystemPrompt(route, profile);
    const userPrompt = buildUserPrompt(request, compressedContext);
    const model = route.agent === 'HOMURA' ? this.appConfig.homuraSearchModel : this.appConfig.geminiFlashModel;

    try {
      const generated =
        route.agent === 'HOMURA'
          ? await this.homura.search(systemPrompt, userPrompt)
          : await this.gemini.generate({
              model,
              systemPrompt,
              userPrompt,
              useGoogleSearch: false
            });

      const parsed = parseModelJson(generated.text, route.mode);
      const citations = [...generated.citations, ...parsed.citations];
      const answer = sectionsToMarkdown(parsed.sections, parsed.answerMarkdown);
      const evidenceId = createId('ev');

      await this.ledger.append({
        eventId: evidenceId,
        timestamp: new Date().toISOString(),
        sessionId,
        requestId,
        route,
        message: request.message,
        contextChars: request.context?.length ?? 0,
        compressedContextChars: compressedContext.length,
        model,
        status: 'ok',
        evidence: request.evidence ?? [],
        citations
      });

      return {
        requestId,
        sessionId,
        route,
        model,
        answer,
        sections: parsed.sections,
        compressedContext,
        citations,
        evidenceId,
        usage: generated.usage
      };
    } catch (error) {
      const evidenceId = createId('ev');
      await this.ledger.append({
        eventId: evidenceId,
        timestamp: new Date().toISOString(),
        sessionId,
        requestId,
        route,
        message: request.message,
        contextChars: request.context?.length ?? 0,
        compressedContextChars: compressedContext.length,
        model,
        status: 'error',
        evidence: request.evidence ?? [],
        citations: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async research(request: KaguraRequest): Promise<KaguraResponse> {
    return this.run({ ...request, mode: 'Research' });
  }

  compress(text: string, maxChars?: number): { compressed: string; originalChars: number; compressedChars: number } {
    const compressed = compressText(text, maxChars ?? 8000);
    return {
      compressed,
      originalChars: text.length,
      compressedChars: compressed.length
    };
  }

  evidence(limit?: number): Promise<unknown[]> {
    return this.ledger.tail(limit);
  }
}
