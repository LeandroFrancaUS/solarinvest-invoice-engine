import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: 'invoice-engine-v1' });
});

export default router;
