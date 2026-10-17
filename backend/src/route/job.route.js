import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  switchJobToRemote,
  applyToJob,
} from '../controller/job.controller.js';
import { verifyToken, roleRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createJobSchema, filterJobsSchema } from '../schema/job.schema.js';

const router = Router();

// Public Job Routes
router.get('/', validate(filterJobsSchema), getJobs);
router.get('/:id', getJobById);

// Recruiter Job Routes
router.post('/', verifyToken, roleRequired('recruiter', 'admin'), validate(createJobSchema), createJob);
router.patch('/:id/to-remote', verifyToken, roleRequired('recruiter', 'admin'), switchJobToRemote);

// Candidate Application Route
router.post('/:id/apply', verifyToken, roleRequired('candidate', 'admin'), applyToJob);

export default router;
