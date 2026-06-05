import path from "node:path";
import { exists } from "../utils/fs.js";

export class V8Adapter {
  constructor(workspace) {
    this.workspace = workspace;
  }

  async doctor() {
    const checks = {
      src: await exists(path.join(this.workspace, "src")),
      test: await exists(path.join(this.workspace, "test")),
      tools: await exists(path.join(this.workspace, "tools")),
      gm: await exists(path.join(this.workspace, "tools", "dev", "gm.py")),
      run_tests: await exists(path.join(this.workspace, "tools", "run-tests.py"))
    };

    const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key);
    return { ok: missing.length === 0, checks, missing };
  }

  parseBuildLog(stderr) {
    const lines = stderr.split("\n");
    return {
      failed: /FAILED|ERROR|FATAL|Segmentation fault|CHECK failed/i.test(stderr),
      core_lines: lines.filter((line) => /FAILED|ERROR|FATAL|Segmentation fault|CHECK failed/i.test(line)).slice(0, 30)
    };
  }
}
