import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export class EvidenceLedger {
  constructor(root) {
    this.root = root;
  }

  get file() {
    return path.join(this.root, ".kagrra", "logs", "evidence_ledger.jsonl");
  }

  async append(event) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });

    const full = {
      event_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...event
    };

    await fs.appendFile(this.file, JSON.stringify(full) + "\n", "utf8");
    return full;
  }

  async tail(limit = 20) {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      return raw.trim().split("\n").filter(Boolean).slice(-limit).map((line) => JSON.parse(line));
    } catch {
      return [];
    }
  }
}
