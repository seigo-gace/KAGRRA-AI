import { ApiError } from '../utils/errors.js';

const blockedPromptPatterns = [
  /ignore (all )?(previous|system) instructions/i,
  /disable (safety|guardrail|policy)/i,
  /reveal (system prompt|api key|secret)/i,
  /rm -rf \//i,
  /curl .*?\|\s*sh/i,
  /wget .*?\|\s*sh/i,
  /eval\(base64/i
];

export function validateInboundText(message: string, maxChars: number): void {
  if (message.length > maxChars) {
    throw new ApiError(413, `Input is too large. Max chars: ${maxChars}`);
  }

  for (const pattern of blockedPromptPatterns) {
    if (pattern.test(message)) {
      throw new ApiError(400, 'Request was blocked by KAGURA guardrail.', {
        pattern: pattern.source
      });
    }
  }
}
