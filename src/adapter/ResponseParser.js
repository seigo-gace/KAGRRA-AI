import { PERSONAS, TOOL_NAMES } from "../types.js";

export class ResponseParser {
  parse(raw, fallbackPersona) {
    try {
      const jsonText = raw.match(/\{[\s\S]*\}/)?.[0] ?? raw;
      const parsed = JSON.parse(jsonText);

      if (!PERSONAS.includes(parsed.persona)) parsed.persona = fallbackPersona;
      if (typeof parsed.summary !== "string") parsed.summary = String(parsed.summary ?? "");
      if (!Array.isArray(parsed.tool_requests)) parsed.tool_requests = [];
      if (!Array.isArray(parsed.evidence)) parsed.evidence = [];
      if (typeof parsed.risk_score !== "number") parsed.risk_score = 50;
      if (typeof parsed.next_action !== "string") parsed.next_action = "SONNET review required.";

      parsed.tool_requests = parsed.tool_requests
        .filter((t) => t && TOOL_NAMES.includes(t.tool))
        .map((t) => ({
          tool: t.tool,
          reason: String(t.reason ?? ""),
          args: typeof t.args === "object" && t.args ? t.args : {},
          risk: Math.max(0, Math.min(100, Number(t.risk ?? 0))),
          requires_write: Boolean(t.requires_write)
        }));

      return parsed;
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
