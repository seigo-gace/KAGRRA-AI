export class IntentReader {
  constructor() { this.name = "intent_reader"; }

  async run(input) {
    const lowered = input.toLowerCase();
    const intent =
      lowered.includes("patch") || lowered.includes("write") ? "mutation_request" :
      lowered.includes("crash") || lowered.includes("bug") ? "failure_investigation" :
      lowered.includes("architecture") || lowered.includes("future") ? "architecture_review" :
      "general_orchestration";

    return { skill: this.name, ok: true, summary: `Intent detected: ${intent}`, data: { intent, original_length: input.length } };
  }
}
