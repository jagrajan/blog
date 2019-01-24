import { Router } from 'express';

import apiV1Router from './api/v1/index';

const router = Router();

router.use('/api/v1', apiV1Router);

export default router;
