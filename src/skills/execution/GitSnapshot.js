import { execFile } from "node:child_process";
import { promisify } from "node:util";
const pexecFile = promisify(execFile);

export class GitSnapshot {
  constructor() { this.name = "git_snapshot"; }

  async run(_input, context) {
    if (context.dryRun) {
      return { skill: this.name, ok: true, summary: "Dry-run git snapshot prepared.", data: { head: "DRY_RUN_HEAD", status: "" } };
    }

    const head = await pexecFile("git", ["rev-parse", "HEAD"], { cwd: context.workspaceRoot }).then((r) => r.stdout.trim()).catch(() => "NO_GIT");
    const status = await pexecFile("git", ["status", "--short"], { cwd: context.workspaceRoot }).then((r) => r.stdout.trim()).catch(() => "");

    return { skill: this.name, ok: true, summary: "Git snapshot captured.", data: { head, status } };
  }
}
