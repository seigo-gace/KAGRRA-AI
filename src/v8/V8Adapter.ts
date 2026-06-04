import { exists } from "../utils/fs.js";
import path from "node:path";

export class V8Adapter {
  constructor(private readonly workspace: string) {}

  async doctor(): Promise<{ ok: boolean; checks: Record<string, boolean>; missing: string[] }> {
    const checks: Record<string, boolean> = {
      src: await exists(path.join(this.workspace, "src")),
      test: await exists(path.join(this.workspace, "test")),
      tools: await exists(path.join(this.workspace, "tools")),
      gm: await exists(path.join(this.workspace, "tools", "dev", "gm.py")),
      run_tests: await exists(path.join(this.workspace, "tools", "run-tests.py"))
    };

    const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key);

    return { ok: missing.length === 0, checks, missing };
  }

  parseBuildLog(stderr: string): { failed: boolean; core_lines: string[] } {
    const lines = stderr.split("\n");
    return {
      failed: /FAILED|ERROR|FATAL|Segmentation fault|CHECK failed/.test(stderr),
      core_lines: lines.filter((line) => /FAILED|ERROR|FATAL|Segmentation fault|CHECK failed/.test(line)).slice(0, 30)
    };
  }
}
