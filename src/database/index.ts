import { Sequelize } from 'sequelize-typescript';

import { environment } from '../config/environment';
import { logger } from '../config/logger';

const modelsPath = `${__dirname}/models`;

const database = new Sequelize(environment.dbUrl, {
  logging: false,
  models: [modelsPath],
});

const databaseConnection = async () => {
  try {
    await database.authenticate();
    logger.info('💾 Database connected');
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error}`);
  }
};

export { database, databaseConnection };

export { User } from './models/User';
export { Game } from './models/Game';
