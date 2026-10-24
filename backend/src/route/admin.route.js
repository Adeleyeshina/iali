import { Router } from 'express';
import {
  getQueues,
  decideQueue,
  submitVerificationRequest,
  submitReport,
  submitWaitlist,
} from '../controller/admin.controller.js';
import { verifyToken, roleRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { adminDecideSchema } from '../schema/admin.schema.js';

const router = Router();

// Trust Centre Queues (Admin only)
router.get('/queues', verifyToken, roleRequired('admin'), getQueues);

// Queue Decisions (Admin only)
router.post('/decide', verifyToken, roleRequired('admin'), validate(adminDecideSchema), decideQueue);

// Verification request submission (Recruiters & HR)
router.post('/verification-request', verifyToken, submitVerificationRequest);

// Safety & Scam Report submission (Candidates & Recruiters)
router.post('/report', verifyToken, submitReport);

// City Waitlist Registration
router.post('/waitlist', verifyToken, submitWaitlist);

export default router;
