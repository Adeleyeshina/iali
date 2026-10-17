import { Router } from 'express';
import {
  searchCandidates,
  createConversation,
} from '../controller/conversation.controller.js';
import { verifyToken, roleRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createConversationSchema,
  searchCandidatesSchema,
} from '../schema/conversation.schema.js';

const router = Router();

// Candidate Search for Recruiters & Admins
router.get('/search/candidates', verifyToken, roleRequired('recruiter', 'admin'), validate(searchCandidatesSchema), searchCandidates);

// Conversations
router.post('/conversations', verifyToken, roleRequired('recruiter', 'admin'), validate(createConversationSchema), createConversation);

export default router;
