import { Router } from 'express';
import type { KaguraService } from '../services/kaguraService.js';
import { compressRequestSchema, kaguraRequestSchema } from '../validation.js';
import { ApiError } from '../utils/errors.js';

export function kaguraRouter(service: KaguraService): Router {
  const router = Router();

  router.get('/v1/manifest', (_req, res) => {
    res.json({
      ok: true,
      manifest: service.manifest()
    });
  });

  router.get('/v1/kagura/evidence', async (req, res, next) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      res.json({
        ok: true,
        evidence: await service.evidence(Number.isFinite(limit) ? limit : 50)
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/v1/kagura/route', (req, res, next) => {
    try {
      const parsed = kaguraRequestSchema.safeParse(req.body);
      if (!parsed.success) throw new ApiError(400, 'Invalid route request.', parsed.error.flatten());
      res.json({
        ok: true,
        route: service.route(parsed.data)
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/v1/kagura/run', async (req, res, next) => {
    try {
      const parsed = kaguraRequestSchema.safeParse(req.body);
      if (!parsed.success) throw new ApiError(400, 'Invalid KAGURA request.', parsed.error.flatten());
      res.json({
        ok: true,
        result: await service.run(parsed.data)
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/v1/kagura/research', async (req, res, next) => {
    try {
      const parsed = kaguraRequestSchema.safeParse(req.body);
      if (!parsed.success) throw new ApiError(400, 'Invalid research request.', parsed.error.flatten());
      res.json({
        ok: true,
        result: await service.research(parsed.data)
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/v1/kagura/compress', (req, res, next) => {
    try {
      const parsed = compressRequestSchema.safeParse(req.body);
      if (!parsed.success) throw new ApiError(400, 'Invalid compression request.', parsed.error.flatten());
      res.json({
        ok: true,
        result: service.compress(parsed.data.text, parsed.data.maxChars)
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
