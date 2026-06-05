import type { OutputMode } from '../types.js';

export const outputSections: Record<OutputMode, string[]> = {
  Normal: ['結論', '理由', '次の行動'],
  Design: ['目的', '現状', '設計', '検証', 'リスク', '次の行動'],
  Development: ['要件', '設計', '実装', 'テスト', 'ロールバック'],
  Debug: ['症状', '原因候補', '検証方法', '修正案', 'ロールバック'],
  Research: ['結論', '根拠', '比較', '推奨', 'リスク'],
  Handoff: ['Goal', 'Current State', 'Completed', 'Pending', 'Risks', 'Next Action']
};

export function emptySections(mode: OutputMode): Record<string, string> {
  return Object.fromEntries(outputSections[mode].map((section) => [section, '']));
}
