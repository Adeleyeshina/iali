import { Router } from 'express';
import authRoute from './auth.route.js';
import jobRoute from './job.route.js';
import profileRoute from './profile.route.js';
import conversationRoute from './conversation.route.js';
import adminRoute from './admin.route.js';
import { getMe } from '../controller/auth.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// /api/me (Used directly by frontend Login & App navbar)
router.get('/me', verifyToken, getMe);

// Feature Subrouters
router.use('/auth', authRoute);
router.use('/jobs', jobRoute);
router.use('/', profileRoute);
router.use('/', conversationRoute);
router.use('/admin', adminRoute);

export default router;
