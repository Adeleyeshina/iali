import { Router } from 'express';
import { signup, confirm, login, getMe } from '../controller/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { signupSchema, loginSchema, confirmSchema } from '../schema/auth.schema.js';

const router = Router();

// POST /api/auth/signup
router.post('/signup', validate(signupSchema), signup);

// POST /api/auth/confirm
router.post('/confirm', validate(confirmSchema), confirm);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// GET /api/auth/me (Protected)
router.get('/me', verifyToken, getMe);

export default router;
