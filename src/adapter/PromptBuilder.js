import fs from "node:fs";
import path from "node:path";

export class PromptBuilder {
  constructor(root = process.cwd()) {
    this.root = root;
  }

  personaPrompt(persona) {
    const file = path.join(this.root, "prompts", "personas", `${persona.toLowerCase()}.md`);
    return fs.readFileSync(file, "utf8");
  }

  systemPrompt() {
    const file = path.join(this.root, "prompts", "system", "kagrra_system.md");
    return fs.readFileSync(file, "utf8");
  }

  build(persona, task, skills) {
    return `
${this.systemPrompt()}

${this.personaPrompt(persona)}

KAGRRA RESPONSE CONTRACT:
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

PRE-RUN SKILL RESULTS:
${JSON.stringify(skills, null, 2)}

USER TASK:
${task}
`;
  }
}
