import { mkdir, appendFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { EvidenceEntry } from '../types.js';

export class EvidenceLedger {
  private readonly ledgerPath: string;

  constructor(evidenceDir: string) {
    this.ledgerPath = path.resolve(evidenceDir, 'evidence_ledger.jsonl');
  }

  async append(entry: EvidenceEntry): Promise<void> {
    await mkdir(path.dirname(this.ledgerPath), { recursive: true });
    await appendFile(this.ledgerPath, `${JSON.stringify(entry)}\n`, 'utf8');
  }

  async tail(limit = 50): Promise<EvidenceEntry[]> {
    try {
      const raw = await readFile(this.ledgerPath, 'utf8');
      return raw
        .split('\n')
        .filter(Boolean)
        .slice(-limit)
        .map((line) => JSON.parse(line) as EvidenceEntry);
    } catch {
      return [];
    }
  }
}
