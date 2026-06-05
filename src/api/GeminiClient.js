export class GeminiClient {
  constructor(apiKey, dryRun) {
    this.apiKey = apiKey;
    this.dryRun = dryRun;
  }

  async generate(model, prompt, expectedPersona) {
    if (this.dryRun || !this.apiKey) {
      return JSON.stringify({
        persona: expectedPersona,
        summary: `[DRY-RUN:${expectedPersona}] Gemini API call skipped. Runtime, persona, skills, parser, security, and evidence are active.`,
        tool_requests: [],
        evidence: ["dry_run", "gemini_client"],
        risk_score: 5,
        next_action: "Set GEMINI_API_KEY and KAGRRA_DRY_RUN=false for live Gemini API call."
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

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ?? "";
  }
}
