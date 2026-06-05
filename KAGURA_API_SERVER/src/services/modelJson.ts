import type { ModelJsonResponse, OutputMode } from '../types.js';
import { emptySections } from '../agents/outputSpec.js';

function stripCodeFence(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
}

export function parseModelJson(text: string, mode: OutputMode): Required<ModelJsonResponse> {
  const fallbackSections = emptySections(mode);

  try {
    const parsed = JSON.parse(stripCodeFence(text)) as ModelJsonResponse;
    return {
      sections: { ...fallbackSections, ...(parsed.sections ?? {}) },
      answerMarkdown: parsed.answerMarkdown ?? text,
      conclusion: parsed.conclusion ?? '',
      risks: parsed.risks ?? [],
      nextAction: parsed.nextAction ?? '',
      citations: parsed.citations ?? []
    };
  } catch {
    return {
      sections: fallbackSections,
      answerMarkdown: text,
      conclusion: '',
      risks: [],
      nextAction: '',
      citations: []
    };
  }
}

export function sectionsToMarkdown(sections: Record<string, string>, fallback: string): string {
  const rendered = Object.entries(sections)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `## ${key}\n${value.trim()}`)
    .join('\n\n');

  return rendered || fallback;
}
