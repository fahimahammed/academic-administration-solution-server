import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsZodSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z
    .string()
    .default('3000')
    .refine((val) => Number(val)),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  PASS_RESET_TOKEN_EXPIRES_IN: z.string(),
  INIT_PAYMENT_ENDPOINT: z.string(),
  USER_DEFAULT_PASS: z.string(),
  CLOUD_NAME: z.string(),
  API_KEY: z.string(),
  API_SECRET: z.string(),
  FORGOT_PASS_RESET_LINK: z.string(),
  EMAIL: z.string(),
  APP_PASS: z.string()
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  userDefaultPassword: envVars.USER_DEFAULT_PASS,
  forgotPasswordResetUiLink: envVars.FORGOT_PASS_RESET_LINK,
  db: {
    url: envVars.DATABASE_URL
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expirationTime: envVars.JWT_EXPIRES_IN,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    refreshExpirationTime: envVars.JWT_REFRESH_EXPIRES_IN,
    passwordResetTokenExpirationTime: envVars.PASS_RESET_TOKEN_EXPIRES_IN
  },
  cloudinary: {
    cloudName: envVars.CLOUD_NAME,
    apiKey: envVars.API_KEY,
    apiSecret: envVars.API_SECRET
  },
  emailSender: {
    email: envVars.EMAIL,
    appPass: envVars.APP_PASS
  },
  paymentService: {
    initPaymentEndpoint: envVars.INIT_PAYMENT_ENDPOINT
  }
};
