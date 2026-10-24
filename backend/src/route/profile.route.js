import { Router } from 'express';
import multer from 'multer';
import {
  getProfile,
  updateProfile,
  parseCv,
  getMyApplications,
  withdrawApplication,
} from '../controller/profile.controller.js';
import { verifyToken, roleRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, parseCvSchema } from '../schema/profile.schema.js';

const router = Router();

const uploadCv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);

// Candidate Profile
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, validate(updateProfileSchema), updateProfile);
router.post('/profile/parse', uploadCv, validate(parseCvSchema), parseCv);

// Candidate Applications
router.get('/applications/mine', verifyToken, getMyApplications);
router.patch('/applications/:id/withdraw', verifyToken, withdrawApplication);

export default router;
