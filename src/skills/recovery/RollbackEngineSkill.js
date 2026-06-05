export class RollbackEngineSkill {
  constructor() { this.name = "rollback_engine"; }

  async run(input, context) {
    return {
      skill: this.name,
      ok: true,
      summary: context.dryRun ? "Dry-run rollback plan prepared." : "Rollback plan prepared.",
      data: {
        steps: ["capture git snapshot", "restore changed files", "rerun tests", "append rollback evidence"],
        inputPreview: input.slice(0, 300)
      }
    };
  }
}
