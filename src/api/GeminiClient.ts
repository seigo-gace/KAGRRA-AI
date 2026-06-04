export class GeminiClient {
  constructor(
    private readonly apiKey: string | undefined,
    private readonly dryRun: boolean
  ) {}

  async generate(model: string, prompt: string): Promise<string> {
    if (this.dryRun || !this.apiKey) {
      return JSON.stringify({
        persona: "SONNET",
        summary: "[DRY-RUN] Gemini API call skipped. Runtime route, prompt, parser, ledger, and tool security are active.",
        tool_requests: [],
        evidence: ["dry_run"],
        risk_score: 5,
        next_action: "Set GEMINI_API_KEY and KAGRRA_DRY_RUN=false for live call."
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, topP: 0.95 }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json() as any;
    return data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") ?? "";
  }
}
