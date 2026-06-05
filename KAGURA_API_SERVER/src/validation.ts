import { z } from 'zod';

export const outputModeSchema = z.enum(['Normal', 'Design', 'Development', 'Debug', 'Research', 'Handoff']);

export const kaguraRequestSchema = z.object({
  message: z.string().min(1).max(24000),
  mode: outputModeSchema.optional(),
  context: z.string().max(48000).optional(),
  constraints: z.array(z.string().max(2000)).max(30).optional(),
  evidence: z.array(z.string().max(4000)).max(30).optional(),
  sessionId: z.string().max(200).optional(),
  requestId: z.string().max(200).optional()
});

export const compressRequestSchema = z.object({
  text: z.string().min(1).max(96000),
  maxChars: z.number().int().positive().max(24000).optional()
});
