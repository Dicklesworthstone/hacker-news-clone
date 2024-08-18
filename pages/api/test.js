// pages/api/test.js
import { createRouter } from 'next-connect';

const router = createRouter();

router.get((req, res) => {
  res.json({ message: 'Hello World' });
});

export default router.handler();
