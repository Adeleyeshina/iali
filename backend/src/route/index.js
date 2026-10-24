import { Router } from 'express';
import authRoute from './auth.route.js';
import jobRoute from './job.route.js';
import profileRoute from './profile.route.js';
import conversationRoute from './conversation.route.js';
import adminRoute from './admin.route.js';
import { getMe } from '../controller/auth.controller.js';
import { submitReport, submitWaitlist, submitVerificationRequest } from '../controller/admin.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// User verification endpoint
router.get('/me', verifyToken, getMe);

// Safety reporting endpoint
router.post('/reports', verifyToken, submitReport);

// City waitlist endpoint
router.post('/waitlist', verifyToken, submitWaitlist);

// Verification request endpoint
router.post('/verifications/request', verifyToken, submitVerificationRequest);

// Feature Subrouters
router.use('/auth', authRoute);
router.use('/jobs', jobRoute);
router.use('/', profileRoute);
router.use('/conversations', conversationRoute);
router.use('/', conversationRoute);
router.use('/admin', adminRoute);

export default router;
