import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import apiRouter from './api';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
