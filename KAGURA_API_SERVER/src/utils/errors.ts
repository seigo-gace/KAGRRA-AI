import type { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
  }
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      ok: false,
      error: error.message,
      details: error.details
    });
    return;
  }

  const message = error instanceof Error ? error.message : 'Unknown server error';
  res.status(500).json({
    ok: false,
    error: message
  });
}
