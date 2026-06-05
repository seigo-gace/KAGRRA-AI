export class EvidenceSummarizer {
  constructor() { this.name = "evidence_summarizer"; }

  async run(input) {
    return {
      skill: this.name,
      ok: true,
      summary: "Evidence summary frame prepared.",
      data: {
        mustInclude: ["route_reason", "skills_used", "tool_requests", "risk_score", "next_action"],
        inputPreview: input.slice(0, 300)
      }
    };
  }
}
