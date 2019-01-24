import { Router } from 'express';

import { getAllUsers } from '../../../../models/User';

const router = Router();

router.get('/', (req, res) => {
  getAllUsers((err, rows) => {
    if (err) {
      res.json({error: 'server-error'});
      return;
    }
    res.json({users: rows});
  });
});

export default router;