import request from 'supertest';
import express from 'express';
import apiRouter from './api';

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: () => ({
    collection: () => ({
      get: () => Promise.resolve({ docs: [] }),
    }),
  }),
}));

const app = express();
app.use('/api', apiRouter);

describe('GET /api/release-notes', () => {
  it('should return a list of products', async () => {
    const res = await request(app).get('/api/release-notes');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
