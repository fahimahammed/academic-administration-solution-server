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
  INIT_PAYMENT_ENDPOINT: z.string(),
  USER_DEFAULT_PASS: z.string()
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  userDefaultPassword: envVars.USER_DEFAULT_PASS,
  db: {
    url: envVars.DATABASE_URL
  },
  jwt: {
    secret: envVars.JWT_SECRET
  },
  paymentService: {
    initPaymentEndpoint: envVars.INIT_PAYMENT_ENDPOINT
  }
};
