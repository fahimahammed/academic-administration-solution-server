import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalExceptionHandler from './app/middlewares/globalExceptionHandler';
import routes from './app/routes';
import { SeedDB } from './db/seed';
import rateLimit from 'express-rate-limit';

const app: Application = express();

// Rate limiter - limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    data: {
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.',
    }
  },
});

app.use(limiter); // Apply the rate limiter to all requests

app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000", "http://localhost:4200", "https://aas-front.vercel.app"]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

SeedDB.seedSuperAdmin(); // seed super admin

app.use('/api/v1', routes);

app.use(globalExceptionHandler);

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API not found',
    errorMessages: [
      {
        path: '',
        message: 'API not found'
      }
    ]
  });
});

export default app;
