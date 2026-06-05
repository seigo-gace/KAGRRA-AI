import type { OutputMode, RouteDecision } from '../types.js';

const routeByMode: Record<OutputMode, Omit<RouteDecision, 'reason' | 'confidence'>> = {
  Normal: { mode: 'Normal', agent: 'HIBIKI', persona: 'SONNET' },
  Handoff: { mode: 'Handoff', agent: 'HIBIKI', persona: 'SONNET' },
  Design: { mode: 'Design', agent: 'SUBARU', persona: 'OPUS' },
  Research: { mode: 'Research', agent: 'HOMURA', persona: 'SEARCH' },
  Debug: { mode: 'Debug', agent: 'KANAME', persona: 'MYTHOS' },
  Development: { mode: 'Development', agent: 'HAYATE', persona: 'HAIKU' }
};

function score(text: string, patterns: RegExp[]): number {
  return patterns.reduce((sum, pattern) => sum + (pattern.test(text) ? 1 : 0), 0);
}

export function routeRequest(message: string, explicitMode?: OutputMode): RouteDecision {
  if (explicitMode) {
    const base = routeByMode[explicitMode];
    return {
      ...base,
      reason: `Explicit mode selected: ${explicitMode}`,
      confidence: 1
    };
  }

  const text = message.toLowerCase();
  const candidates: Array<{ mode: OutputMode; score: number; reason: string }> = [
    {
      mode: 'Research',
      score: score(text, [/search|research|調査|検索|比較|根拠|citation|cite|最新|fact|裏取り|ground/]),
      reason: 'Search, grounding, or comparison signals detected.'
    },
    {
      mode: 'Debug',
      score: score(text, [/debug|error|failure|failed|crash|log|trace|再現|失敗|原因|検証|runtime|regression/]),
      reason: 'Debug, failure, log, or runtime signals detected.'
    },
    {
      mode: 'Development',
      score: score(text, [/patch|implement|code|fix|write|修正|実装|生成|rollback|test|build|api|server|deploy/]),
      reason: 'Implementation, patch, or deployment signals detected.'
    },
    {
      mode: 'Design',
      score: score(text, [/design|architecture|設計|構想|仕様|roadmap|長期|技術判断|方針|要件/]),
      reason: 'Design, architecture, or long-term direction signals detected.'
    },
    {
      mode: 'Handoff',
      score: score(text, [/handoff|引継ぎ|引き継ぎ|summary|要約|次回|ログ収集|context/]),
      reason: 'Handoff or summary signals detected.'
    }
  ];

  const best = candidates.sort((a, b) => b.score - a.score)[0];
  if (!best || best.score === 0) {
    return {
      ...routeByMode.Normal,
      reason: 'No strong specialist signal detected; route to HIBIKI for normal composition.',
      confidence: 0.55
    };
  }

  return {
    ...routeByMode[best.mode],
    reason: best.reason,
    confidence: Math.min(0.95, 0.6 + best.score * 0.1)
  };
}
