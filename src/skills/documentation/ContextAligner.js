export class ContextAligner {
  constructor() { this.name = "context_aligner"; }

  async run(input, context) {
    return {
      skill: this.name,
      ok: true,
      summary: "Context aligned with active runtime policy.",
      data: {
        workspaceRoot: context.workspaceRoot,
        v8Workspace: context.v8Workspace,
        dryRun: context.dryRun,
        taskPreview: input.slice(0, 300)
      }
    };
  }
}
