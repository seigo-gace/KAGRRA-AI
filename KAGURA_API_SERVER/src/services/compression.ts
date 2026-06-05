const retentionLabels = [
  'Goal',
  'Decision',
  'Constraint',
  'Risk',
  'Pending',
  'Architecture',
  'Evidence',
  'Rollback'
];

function normalizeLines(text: string): string[] {
  const seen = new Set<string>();
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const key = line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function compressText(text = '', maxChars = 8000): string {
  if (!text.trim()) return '';
  if (text.length <= maxChars) return text.trim();

  const lines = normalizeLines(text);
  const retained: string[] = [];
  const lowerLabels = retentionLabels.map((label) => label.toLowerCase());

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (
      lowerLabels.some((label) => lower.includes(label.toLowerCase())) ||
      /目的|決定|制約|リスク|保留|設計|証跡|根拠|ロールバック/.test(line)
    ) {
      retained.push(line);
    }
  }

  const head = lines.slice(0, 30);
  const merged = [...retained, ...head].join('\n');
  const clipped = merged.length > maxChars ? merged.slice(0, maxChars) : merged;

  return [
    '# Token Compression Summary',
    'Preserved: Goal, Decision, Constraint, Risk, Pending, Architecture, Evidence, Rollback.',
    '',
    clipped
  ].join('\n');
}
