import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import apiRouter from './api';
import logger from './logger';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

app.use('/api', apiRouter);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
