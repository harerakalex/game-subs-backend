const config = require('dotenv').config;

config();

const nodeEnv = process.env.NODE_ENV;

const database = {
  [nodeEnv]: {
    databaseUrl: process.env.DATABASE_URL,
    dialect: process.env.DATABASE_DIALECT || 'postgres',
    logging: false,
    use_env_variable: 'DATABASE_URL',
  },
};

module.exports = database;
