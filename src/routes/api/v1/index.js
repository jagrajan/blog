import { Router } from 'express';
import passport from 'passport';

import authRouter from './auth/auth';
import userRouter from './user/user';

import { ensureAuthenticated } from '../../../middleware/auth';

const router = Router();

router.get('/protected', ensureAuthenticated(true),
  (req, res) => {
    return res.json({ message: 'greetings!' });
  }
);

router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
