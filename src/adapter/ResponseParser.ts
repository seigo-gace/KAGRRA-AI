import { z } from "zod";
import { KagrraResponse, PersonaName } from "../types.js";

const ToolSchema = z.object({
  tool: z.enum([
    "read_file",
    "list_files",
    "grep_search",
    "git_snapshot",
    "run_v8_build",
    "run_v8_test",
    "propose_patch",
    "atomic_write",
    "rollback",
    "failure_graph",
    "log_evidence"
  ]),
  reason: z.string(),
  args: z.record(z.unknown()).default({}),
  risk: z.number().min(0).max(100).default(0),
  requires_write: z.boolean().default(false)
});

const ResponseSchema = z.object({
  persona: z.enum(["SONNET", "OPUS", "MYTHOS", "HAIKU"]),
  summary: z.string(),
  tool_requests: z.array(ToolSchema).default([]),
  evidence: z.array(z.string()).default([]),
  risk_score: z.number().min(0).max(100).default(0),
  next_action: z.string()
});

export class ResponseParser {
  parse(raw: string, fallbackPersona: PersonaName): KagrraResponse {
    try {
      const jsonText = raw.match(/\{[\s\S]*\}/)?.[0] ?? raw;
      return ResponseSchema.parse(JSON.parse(jsonText));
    } catch {
      return {
        persona: fallbackPersona,
        summary: raw,
        tool_requests: [],
        evidence: ["parser_fallback"],
        risk_score: 50,
        next_action: "SONNET review required."
      };
    }
  }
}
