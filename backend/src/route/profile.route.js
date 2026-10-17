import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  parseCv,
  getMyApplications,
} from '../controller/profile.controller.js';
import { verifyToken, roleRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, parseCvSchema } from '../schema/profile.schema.js';

const router = Router();

// Candidate Profile
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, validate(updateProfileSchema), updateProfile);
router.post('/profile/parse', validate(parseCvSchema), parseCv);

// Candidate Applications
router.get('/applications/mine', verifyToken, getMyApplications);

export default router;
