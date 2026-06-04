import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { EvidenceEvent } from "../types.js";

export class EvidenceLedger {
  constructor(private readonly root: string) {}

  private get file(): string {
    return path.join(this.root, ".kagrra", "logs", "evidence_ledger.jsonl");
  }

  async append(event: Omit<EvidenceEvent, "event_id" | "timestamp">): Promise<EvidenceEvent> {
    await fs.mkdir(path.dirname(this.file), { recursive: true });

    const full: EvidenceEvent = {
      event_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...event
    };

    await fs.appendFile(this.file, JSON.stringify(full) + "\n", "utf8");

    return full;
  }

  async tail(limit = 20): Promise<EvidenceEvent[]> {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      return raw.trim().split("\n").filter(Boolean).slice(-limit).map((line) => JSON.parse(line) as EvidenceEvent);
    } catch {
      return [];
    }
  }
}
