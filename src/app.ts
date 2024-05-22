import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import httpStatus from 'http-status';
import globalExceptionHandler from './app/middlewares/globalExceptionHandler';
import routes from './app/routes';
import { SeedDB } from './db/seed';

const app: Application = express();

app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000", "http://localhost:4200"]
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
