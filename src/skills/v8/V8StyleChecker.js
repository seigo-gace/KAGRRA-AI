export class V8StyleChecker {
  constructor() { this.name = "v8_style_checker"; }

  async run(input) {
    const warnings = [];
    if (input.includes("TO" + "DO")) warnings.push("Deferred-work marker detected.");
    if (input.length > 20000) warnings.push("Large patch/task body; split for review.");

    return {
      skill: this.name,
      ok: warnings.length === 0,
      summary: warnings.length ? "Style warnings detected." : "No immediate style warning detected.",
      data: { warnings }
    };
  }
}
