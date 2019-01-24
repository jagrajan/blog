import { Router } from 'express';
import passport from 'passport';

import authRouter from './auth/auth';
import userRouter from './user/user';

const router = Router();

router.get('/protected', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.json({ message: 'greetings!' });
  }
);

router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
