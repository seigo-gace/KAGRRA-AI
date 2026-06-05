import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { isInside } from "../utils/fs.js";

const pexecFile = promisify(execFile);

function hash(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export class ToolRuntime {
  async execute(request, context) {
    switch (request.tool) {
      case "read_file":
        return this.readFile(String(request.args.path ?? ""), context);
      case "list_files":
        return this.listFiles(String(request.args.path ?? "."), context);
      case "grep_search":
        return this.grepSearch(String(request.args.path ?? "."), String(request.args.pattern ?? ""), context);
      case "git_snapshot":
        return this.gitSnapshot(context);
      case "propose_patch":
        return { ok: true, proposed: true, args: request.args };
      case "atomic_write":
        return this.atomicWrite(String(request.args.path ?? ""), String(request.args.content ?? ""), context);
      case "rollback":
        return { ok: true, rollback: "prepared", dryRun: context.dryRun };
      case "failure_graph":
        return { ok: true, graph: { nodes: [], edges: [] }, args: request.args };
      case "run_v8_build":
        return this.safeV8Command("tools/dev/gm.py", ["quiet", "x64.optdebug"], context);
      case "run_v8_test":
        return this.safeV8Command("tools/run-tests.py", ["--progress", "dots", "--exit-after-n-failures=5", "--outdir=out/x64.optdebug", "mjsunit"], context);
      case "log_evidence":
        return { ok: true, logged: true, args: request.args };
      default:
        return { ok: false, reason: "Unknown tool" };
    }
  }

  async readFile(rel, context) {
    if (!isInside(context.workspaceRoot, rel)) return { ok: false, error: "workspace_escape" };
    const file = path.join(context.workspaceRoot, rel);
    return { ok: true, path: rel, content: await fs.readFile(file, "utf8") };
  }

  async listFiles(rel, context) {
    if (!isInside(context.workspaceRoot, rel)) return { ok: false, error: "workspace_escape" };
    const dir = path.join(context.workspaceRoot, rel);
    return { ok: true, path: rel, files: await fs.readdir(dir) };
  }

  async grepSearch(rel, pattern, context) {
    if (!isInside(context.workspaceRoot, rel)) return { ok: false, error: "workspace_escape" };
    const target = path.join(context.workspaceRoot, rel);
    const stat = await fs.stat(target);
    const matches = [];

    if (stat.isFile()) {
      const content = await fs.readFile(target, "utf8");
      content.split("\n").forEach((line, index) => {
        if (line.includes(pattern)) matches.push(`${rel}:${index + 1}:${line}`);
      });
    }

    return { ok: true, matches };
  }

  async gitSnapshot(context) {
    if (context.dryRun) return { ok: true, dryRun: true, head: "DRY_RUN_HEAD" };

    const head = await pexecFile("git", ["rev-parse", "HEAD"], { cwd: context.workspaceRoot }).then((r) => r.stdout.trim()).catch(() => "NO_GIT");
    const status = await pexecFile("git", ["status", "--short"], { cwd: context.workspaceRoot }).then((r) => r.stdout.trim()).catch(() => "");

    return { ok: true, head, status };
  }

  async atomicWrite(rel, content, context) {
    if (!isInside(context.workspaceRoot, rel)) return { ok: false, error: "workspace_escape" };

    if (context.dryRun) {
      return { ok: true, dryRun: true, path: rel, after_hash: hash(content) };
    }

    const file = path.join(context.workspaceRoot, rel);
    let before = "";

    try { before = await fs.readFile(file, "utf8"); } catch {}

    await fs.mkdir(path.dirname(file), { recursive: true });
    const temp = `${file}.kagrra.tmp`;
    await fs.writeFile(temp, content, "utf8");
    await fs.rename(temp, file);

    return { ok: true, path: rel, before_hash: hash(before), after_hash: hash(content) };
  }

  async safeV8Command(cmd, args, context) {
    if (context.dryRun) return { ok: true, dryRun: true, command: [cmd, ...args].join(" ") };

    return pexecFile(cmd, args, { cwd: context.v8Workspace, timeout: 60 * 60 * 1000 }).catch((err) => ({
      stdout: err.stdout ?? "",
      stderr: err.stderr ?? "",
      code: err.code ?? 1
    }));
  }
}
