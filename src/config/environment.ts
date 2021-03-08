import dotenv from 'dotenv';

dotenv.config();

const environment = {
  port: process.env.PORT || 3500,
  env: process.env.NODE_ENV || 'development',
  dbUrl: process.env.DATABASE_URL,
};

export { environment };
