import { config } from './config.js';
import { createApp } from './app.js';

const app = createApp(config);

app.listen(config.port, config.host, () => {
  console.log(`KAGURA API server listening on http://${config.host}:${config.port}`);
});
