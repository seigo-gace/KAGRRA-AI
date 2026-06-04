import { PersonaName } from "../types.js";

const personaPrompt: Record<PersonaName, string> = {
  SONNET: "You are SONNET. Golden-ratio orchestration. Specialized Skill: Technical Documentation. No direct write.",
  OPUS: "You are OPUS. World-model architecture. Specialized Skill: Deep Research / Search. No direct write.",
  MYTHOS: "You are MYTHOS. 16-lane failure exploration. Specialized Skill: Architecture Visualization / Failure Mapping. No mutation.",
  HAIKU: "You are HAIKU. Atomic execution. Specialized Skill: Atomic Coding / Git-safe Execution. Reversible writes only."
};

export class PromptBuilder {
  build(persona: PersonaName, task: string): string {
    return `
${personaPrompt[persona]}

Return strict JSON only:
{
  "persona": "${persona}",
  "summary": "string",
  "tool_requests": [
    {
      "tool": "read_file | list_files | grep_search | git_snapshot | run_v8_build | run_v8_test | propose_patch | atomic_write | rollback | failure_graph | log_evidence",
      "reason": "string",
      "args": {},
      "risk": 0,
      "requires_write": false
    }
  ],
  "evidence": ["string"],
  "risk_score": 0,
  "next_action": "string"
}

Task:
${task}
`;
  }
}
