export class TechnicalDebtAnalyzer {
  constructor() { this.name = "technical_debt_analyzer"; }

  async run(input) {
    const complexity = Math.min(40, Math.ceil(input.length / 100));
    const uncertainty = /unknown|crash|failure|security|regression/i.test(input) ? 25 : 10;
    const scope = /architecture|refactor|replace/i.test(input) ? 25 : 10;
    const score = Math.min(100, complexity + uncertainty + scope);

    return {
      skill: this.name,
      ok: true,
      summary: `Technical debt score estimated: ${score}`,
      data: {
        score,
        recommendation: score >= 90 ? "replace_not_patch" : score >= 75 ? "refactor_required" : "local_change_allowed"
      }
    };
  }
}
