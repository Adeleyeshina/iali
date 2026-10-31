import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  switchJobToRemote,
  updateJob,
  deleteJob,
  applyToJob,
  getRecruiterJobs,
  getJobApplications,
  updateApplicationStatus,
} from '../controller/job.controller.js';
import { verifyToken, roleRequired, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createJobSchema, updateJobSchema, filterJobsSchema } from '../schema/job.schema.js';

const router = Router();

// Recruiter jobs overview
router.get('/recruiter/mine', verifyToken, roleRequired('recruiter', 'admin'), getRecruiterJobs);
router.patch('/applications/:id/status', verifyToken, roleRequired('recruiter', 'admin'), updateApplicationStatus);

// Public Job Routes
router.get('/', optionalAuth, validate(filterJobsSchema), getJobs);
router.get('/:id', optionalAuth, getJobById);
router.get('/:id/applications', verifyToken, roleRequired('recruiter', 'admin'), getJobApplications);

// Recruiter Job Routes
router.post('/', verifyToken, roleRequired('recruiter', 'admin'), validate(createJobSchema), createJob);
router.patch('/:id/to-remote', verifyToken, roleRequired('recruiter', 'admin'), switchJobToRemote);
router.patch('/:id', verifyToken, roleRequired('recruiter', 'admin'), validate(updateJobSchema), updateJob);
router.delete('/:id', verifyToken, roleRequired('recruiter', 'admin'), deleteJob);

// Candidate Application Route
router.post('/:id/apply', verifyToken, roleRequired('candidate', 'admin'), applyToJob);

export default router;
