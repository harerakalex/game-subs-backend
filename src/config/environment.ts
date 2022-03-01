import dotenv from 'dotenv';

dotenv.config();

const environment = {
  port: process.env.PORT || 3500,
  env: process.env.NODE_ENV || 'development',
  dbUrl: process.env.DATABASE_URL,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  emailSender: process.env.EMAIL_SENDER,
  sengGridApiKey: process.env.SENDGRID_API_KEY,
};

export { environment };
