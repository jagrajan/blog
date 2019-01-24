import { Router } from 'express';

import { login } from '../../../../models/Auth';
import { createUser } from '../../../../models/User';

const router = Router();

router.post('/register', (req, res) => {
  createUser(req.body.email, req.body.password, (err, rows) => {
    if (err) {
      res.json({error: 'server-error'});
      return;
    }
    res.json({result: rows});
  });
});

router.post('/login', (req, res) => {
  login(req.body.email, req.body.password, req.fingerprint.hash, (err, ret) => {
    if (err) {
      return res.json({ error: 'server-error' });
    }
    return res.json(ret);
  });
});

export default router;
