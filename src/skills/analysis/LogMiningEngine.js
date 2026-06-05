export class LogMiningEngine {
  constructor() { this.name = "log_mining_engine"; }

  async run(input) {
    const lines = input.split("\n");
    const core = lines.filter((line) => /FAILED|ERROR|FATAL|Segmentation fault|CHECK failed|timeout/i.test(line)).slice(0, 30);

    return {
      skill: this.name,
      ok: true,
      summary: core.length ? "Core error lines extracted." : "No obvious core error lines found.",
      data: { coreLines: core }
    };
  }
}
