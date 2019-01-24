import { Router } from 'express';
import passport from 'passport';

import authRouter from './auth/auth';
import { getAllUsers, createUser } from '../../../models/User';
import { login } from '../../../models/Auth';

const router = Router();

router.get('/protected', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.json({ message: 'greetings!' });
  }
);

router.post('/login', (req, res) => {
  console.log(req.body);
  login(req.body.email, req.body.password, (err, ret) => {
    if (err) {
      return res.json({ error: 'server-error' });
    }
    return res.json(ret);
  });
});

router.post('/create', (req, res) => {
  console.log(req.body);
  createUser(req.body.email, req.body.password, (err, rows) => {
    if (err) {
      res.json({error: 'server-error'});
      return;
    }
    res.json({result: rows});
  });
});

router.get('/', (req, res) => {
  getAllUsers((err, rows) => {
    if (err) {
      res.json({error: 'server-error'});
      return;
    }
    res.json({users: rows});
  });
});

//router.use('/auth', authRouter);

export default router;
