import express from 'express';
import * as admin from 'firebase-admin';

const router = express.Router();

// Ensure Firebase is initialized in batch-process.ts or a central file
// If not, you would initialize it here as well.
const db = admin.firestore();

router.get('/release-notes', async (req, res) => {
  try {
    const snapshot = await db.collection('release-notes').get();
    const notes = snapshot.docs.map(doc => doc.data());
    res.json(notes);
  } catch (error) {
    console.error('Error fetching release notes from Firestore:', error);
    res.status(500).send('Error fetching release notes');
  }
});

export default router;