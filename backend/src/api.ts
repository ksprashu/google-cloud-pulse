import express from 'express';

const router = express.Router();

router.get('/release-notes', (req, res) => {
  // Mock data for now
  res.json([
    {
      productName: 'Compute Engine',
      notes: [
        {
          id: '1',
          updated: new Date(),
          originalTitle: 'New Feature: Faster Boot Times',
          summary: 'We have improved boot times for all instances.',
          changeType: 'Feature',
          releaseStage: 'General Availability',
        },
      ],
      lastUpdated: new Date(),
      isRecent: true,
    },
  ]);
});

export default router;
