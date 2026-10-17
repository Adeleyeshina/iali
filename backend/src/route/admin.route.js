import { Router } from 'express';
import { getQueues, decideQueue } from '../controller/admin.controller.js';
import { verifyToken, roleRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { adminDecideSchema } from '../schema/admin.schema.js';

const router = Router();

// Trust Centre Queues
router.get('/queues', verifyToken, roleRequired('admin'), getQueues);

// Queue Decisions
router.post('/decide', verifyToken, roleRequired('admin'), validate(adminDecideSchema), decideQueue);

export default router;
