import express from 'express';
import cors from 'cors';
import apiRouter from './api';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
