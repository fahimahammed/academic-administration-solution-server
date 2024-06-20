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
  APP_PASS: z.string(),
  STORE_ID: z.string(),
  STORE_PASSWORD: z.string(),
  PAYMENT_API: z.string(),
  VALIDATION_API: z.string(),
  SUCCESS_URL: z.string(),
  CANCEL_URL: z.string(),
  FAILED_URL: z.string(),
  SUPER_ADMIN_PASS: z.string(),
  TEST_BASE: z.string(),
  TEST_SUPER_ADMIN_TOKEN: z.string(),
  TEST_ADMIN_TOKEN: z.string(),
  TEST_FACULTY_TOKEN: z.string(),
  TEST_STUDENT_TOKEN: z.string(),
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  userDefaultPassword: envVars.USER_DEFAULT_PASS,
  forgotPasswordResetUiLink: envVars.FORGOT_PASS_RESET_LINK,
  superAdminPassword: envVars.SUPER_ADMIN_PASS,
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
  ssl: {
    storeId: envVars.STORE_ID,
    storePass: envVars.STORE_PASSWORD,
    paymentApi: envVars.PAYMENT_API,
    validationApi: envVars.VALIDATION_API,
    successUrl: envVars.SUCCESS_URL,
    cancelUrl: envVars.CANCEL_URL,
    failedUrl: envVars.FAILED_URL
  },
  test: {
    baseApi: envVars.TEST_BASE,
    superAdminToken: envVars.TEST_SUPER_ADMIN_TOKEN,
    adminToken: envVars.TEST_ADMIN_TOKEN,
    facultyToken: envVars.TEST_FACULTY_TOKEN,
    studentToken: envVars.TEST_STUDENT_TOKEN
  }
};
