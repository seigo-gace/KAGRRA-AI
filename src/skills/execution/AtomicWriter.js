import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { isInside } from "../../utils/fs.js";

function hash(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export class AtomicWriter {
  constructor() { this.name = "atomic_writer"; }

  async run(input, context) {
    const match = input.match(/WRITE_FILE\s+(.+?)\n([\s\S]*)/i);

    if (!match) {
      return { skill: this.name, ok: true, summary: "Atomic writer idle: no WRITE_FILE instruction.", data: { requiredFormat: "WRITE_FILE <path>\\n<content>" } };
    }

    const relPath = match[1].trim();
    const content = match[2];

    if (!isInside(context.workspaceRoot, relPath)) {
      return { skill: this.name, ok: false, summary: "Workspace escape blocked.", error: relPath };
    }

    if (context.dryRun) {
      return { skill: this.name, ok: true, summary: "Dry-run atomic write accepted. No file changed.", data: { path: relPath, afterHash: hash(content) } };
    }

    const target = path.join(context.workspaceRoot, relPath);
    let before = "";

    try {
      before = await fs.readFile(target, "utf8");
    } catch {}

    await fs.mkdir(path.dirname(target), { recursive: true });
    const temp = `${target}.kagrra.tmp`;
    await fs.writeFile(temp, content, "utf8");
    await fs.rename(temp, target);

    return { skill: this.name, ok: true, summary: "Atomic write completed.", data: { path: relPath, beforeHash: hash(before), afterHash: hash(content) } };
  }
}
