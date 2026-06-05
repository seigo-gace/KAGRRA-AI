export class PatchPlanner {
  constructor() { this.name = "patch_planner"; }

  async run(input) {
    const hasWriteFile = /WRITE_FILE\s+.+?\n[\s\S]+/i.test(input);

    return {
      skill: this.name,
      ok: true,
      summary: hasWriteFile ? "WRITE_FILE patch instruction detected." : "No direct WRITE_FILE patch instruction detected.",
      data: { acceptedFormat: "WRITE_FILE <relative-path>\\n<content>", hasWriteFile }
    };
  }
}
