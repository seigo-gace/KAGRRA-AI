import type { AgentId, AgentProfile } from '../types.js';

export const agentProfiles: Record<AgentId, AgentProfile> = {
  HIBIKI: {
    agent: 'HIBIKI',
    persona: 'SONNET',
    displayName: 'ヒビキ',
    modelRole: 'Document conductor and final composer',
    owns: ['Normal', 'Handoff'],
    canSearch: false,
    canWrite: false,
    maxTurns: 3,
    maxToolCalls: 0,
    responsibilities: ['intent capture', 'routing', 'summary', 'handoff', 'final output'],
    forbidden: ['direct write', 'direct execution', 'unsupported claims']
  },
  SUBARU: {
    agent: 'SUBARU',
    persona: 'OPUS',
    displayName: 'スバル',
    modelRole: 'Design authority and long-term architecture reviewer',
    owns: ['Design'],
    canSearch: false,
    canWrite: false,
    maxTurns: 4,
    maxToolCalls: 0,
    responsibilities: ['architecture', 'tradeoff analysis', 'future risk', 'technical debt'],
    forbidden: ['direct write', 'direct patch', 'runtime mutation']
  },
  KANAME: {
    agent: 'KANAME',
    persona: 'MYTHOS',
    displayName: 'カナメ',
    modelRole: 'Runtime debug and failure convergence',
    owns: ['Debug'],
    canSearch: false,
    canWrite: false,
    maxTurns: 5,
    maxToolCalls: 0,
    responsibilities: ['debug', 'trace', 'log mining', 'reproduction planning', 'root cause analysis'],
    forbidden: ['direct write', 'delete', 'migration', 'force rewrite']
  },
  HAYATE: {
    agent: 'HAYATE',
    persona: 'HAIKU',
    displayName: 'ハヤテ',
    modelRole: 'Atomic development and rollback-safe execution planner',
    owns: ['Development'],
    canSearch: false,
    canWrite: true,
    maxTurns: 3,
    maxToolCalls: 1,
    responsibilities: ['minimal patch plan', 'rollback plan', 'test plan', 'scoped development'],
    forbidden: ['wide rewrite', 'unscoped patch', 'rollbackless change']
  },
  HOMURA: {
    agent: 'HOMURA',
    persona: 'SEARCH',
    displayName: 'ホムラ',
    modelRole: 'Grounded search specialist',
    owns: ['Research'],
    canSearch: true,
    canWrite: false,
    maxTurns: 3,
    maxToolCalls: 2,
    responsibilities: ['search', 'grounding', 'citation extraction', 'KB補完', 'fact verification'],
    forbidden: ['design authority alone', 'write', 'patch', 'uncited factual claim when search is required']
  }
};
