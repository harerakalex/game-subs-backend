import http from 'http';
import { AddressInfo } from 'net';

import { app } from './index';
import { databaseConnection } from './database';
import { logger } from './config/logger';
import { environment } from './config/environment';

(async () => {
  const { port } = environment;

  await databaseConnection();

  const server = http.createServer(app);

  server.listen(port, () => {
    const address: AddressInfo | string | null = server.address();

    if (address && typeof address !== 'string') {
      logger.info(`⚡️ Server is running at http://localhost:${port}`);
    } else {
      logger.error(`Unable to start server on port ${port}`);
    }
  });
})();
