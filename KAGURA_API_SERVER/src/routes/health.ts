import { Router } from 'express';

export function healthRouter(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'kagura-phase1-api-server',
      timestamp: new Date().toISOString()
    });
  });

  return router;
}
