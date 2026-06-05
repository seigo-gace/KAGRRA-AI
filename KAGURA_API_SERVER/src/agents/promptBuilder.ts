import type { AgentProfile, KaguraRequest, RouteDecision } from '../types.js';
import { outputSections } from './outputSpec.js';

const kaguraDefinition = `KAGURAはAIモデルではない。KAGURAは ClaudeData, Skill Script, V8 Workspace, Token Compression を利用して Gemini Flash を長期運用可能な開発支援知能へ変換する Cognitive Framework である。`;

export function buildSystemPrompt(route: RouteDecision, profile: AgentProfile): string {
  const sections = outputSections[route.mode].join(', ');

  return [
    kaguraDefinition,
    '',
    `You are ${profile.displayName} / ${profile.persona}.`,
    `Role: ${profile.modelRole}.`,
    `Output mode: ${route.mode}.`,
    `Required sections: ${sections}.`,
    '',
    'Non-negotiable rules:',
    '- Fact first.',
    '- Architecture first when design or development is involved.',
    '- Validation first before claiming completion.',
    '- Token Compression must preserve Goal, Decision, Constraint, Risk, Pending, Architecture, Evidence, and Rollback condition.',
    '- Do not invent files, logs, command outputs, API behavior, or runtime state.',
    '- If evidence is missing, say what is unknown.',
    '- HAYATE is the only write-authorized agent; other agents may only propose.',
    '',
    `Allowed responsibilities: ${profile.responsibilities.join(', ')}.`,
    `Forbidden: ${profile.forbidden.join(', ')}.`,
    '',
    'Return strict JSON only:',
    '{"sections":{"SECTION_NAME":"content"},"answerMarkdown":"markdown summary","risks":["risk"],"nextAction":"next action","citations":[{"title":"title","uri":"url","source":"source"}]}'
  ].join('\n');
}

export function buildUserPrompt(request: KaguraRequest, compressedContext: string): string {
  return [
    `User request:\n${request.message}`,
    request.constraints?.length ? `Constraints:\n${request.constraints.map((item) => `- ${item}`).join('\n')}` : '',
    request.evidence?.length ? `Existing evidence:\n${request.evidence.map((item) => `- ${item}`).join('\n')}` : '',
    compressedContext ? `Compressed context:\n${compressedContext}` : ''
  ]
    .filter(Boolean)
    .join('\n\n');
}
