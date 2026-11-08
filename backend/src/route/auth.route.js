import { Router } from 'express';
import { signup, confirm, login, getMe } from '../controller/auth.controller.js';
import {
  initiateGoogleAuth,
  handleGoogleCallback,
  initiateLinkedInAuth,
  handleLinkedInCallback,
  handleMockOAuthCallback,
} from '../controller/oauth.controller.js';
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

// OAuth 2.0 Routes
// Google OAuth 2.0
router.get('/google', initiateGoogleAuth);
router.get('/google/callback', handleGoogleCallback);

// LinkedIn OAuth 2.0 (OpenID Connect)
router.get('/linkedin', initiateLinkedInAuth);
router.get('/linkedin/callback', handleLinkedInCallback);

// Mock/Dev fallback callback (active in dev/demo when API keys are pending)
router.get('/mock-oauth-callback', handleMockOAuthCallback);

export default router;
