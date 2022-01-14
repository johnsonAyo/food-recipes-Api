import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import ErrorHandler from './utils/appError';
import globalErrorHandler from './controllers/errorController';

import userRouter from './routes/userRoutes';
import recipeRouter from './routes/recipeRoutes';
import { connectTestDB } from './db/db';

const dotenv = require('dotenv');


dotenv.config({ path: './config.env' });

// Start express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Test middleware
app.use((req: any, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});



if (process.env.NODE_ENV === 'test') connectTestDB();
else {
  const DB = (process.env.DATABASE as string).replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD as string
  );

  mongoose
    .connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log(`DB connection successful!`));
}

// 3) ROUTES
app.use('/recipes', recipeRouter);
app.use('/users', userRouter);
// app.use('/restaurant', restaurantRouter);

app.all('*', (req, res, next) => {
  next(ErrorHandler(404, `Can't find ${req.originalUrl} on this server!`, {}));
});

app.use(globalErrorHandler);

 export default app
