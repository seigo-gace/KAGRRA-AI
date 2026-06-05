import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import type { AppConfig } from './config.js';
import { healthRouter } from './routes/health.js';
import { kaguraRouter } from './routes/kagura.js';
import { KaguraService } from './services/kaguraService.js';
import { errorHandler } from './utils/errors.js';

function corsOrigin(appConfig: AppConfig): cors.CorsOptions['origin'] {
  if (appConfig.corsOrigins.includes('*')) return true;
  return (origin, callback) => {
    if (!origin || appConfig.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS origin denied.'));
  };
}

export function createApp(appConfig: AppConfig): express.Express {
  const app = express();
  const service = new KaguraService(appConfig);

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: corsOrigin(appConfig) }));
  app.use(express.json({ limit: '2mb' }));

  app.use(healthRouter());
  app.use(kaguraRouter(service));
  app.use(errorHandler);

  return app;
}
