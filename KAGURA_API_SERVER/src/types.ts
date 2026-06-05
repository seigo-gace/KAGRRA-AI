export type OutputMode = 'Normal' | 'Design' | 'Development' | 'Debug' | 'Research' | 'Handoff';

export type AgentId = 'HIBIKI' | 'SUBARU' | 'KANAME' | 'HAYATE' | 'HOMURA';

export type PersonaId = 'SONNET' | 'OPUS' | 'MYTHOS' | 'HAIKU' | 'SEARCH';

export interface AgentProfile {
  agent: AgentId;
  persona: PersonaId;
  displayName: string;
  modelRole: string;
  owns: OutputMode[];
  canSearch: boolean;
  canWrite: boolean;
  maxTurns: number;
  maxToolCalls: number;
  responsibilities: string[];
  forbidden: string[];
}

export interface RouteDecision {
  mode: OutputMode;
  agent: AgentId;
  persona: PersonaId;
  reason: string;
  confidence: number;
}

export interface KaguraRequest {
  message: string;
  mode?: OutputMode;
  context?: string;
  constraints?: string[];
  evidence?: string[];
  sessionId?: string;
  requestId?: string;
}

export interface ModelJsonResponse {
  sections?: Record<string, string>;
  answerMarkdown?: string;
  conclusion?: string;
  risks?: string[];
  nextAction?: string;
  citations?: Citation[];
}

export interface Citation {
  title?: string;
  uri?: string;
  source?: string;
}

export interface KaguraResponse {
  requestId: string;
  sessionId: string;
  route: RouteDecision;
  model: string;
  answer: string;
  sections: Record<string, string>;
  compressedContext: string;
  citations: Citation[];
  evidenceId: string;
  usage?: Record<string, unknown>;
}

export interface EvidenceEntry {
  eventId: string;
  timestamp: string;
  sessionId: string;
  requestId: string;
  route: RouteDecision;
  message: string;
  contextChars: number;
  compressedContextChars: number;
  model: string;
  status: 'ok' | 'error';
  evidence: string[];
  citations: Citation[];
  error?: string;
}
