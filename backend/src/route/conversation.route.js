import { Router } from 'express';
import {
  searchCandidates,
  createConversation,
  getMyConversations,
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

// Conversation routes supporting both root and explicit subpath
router.get('/', verifyToken, getMyConversations);
router.get('/conversations', verifyToken, getMyConversations);
router.post('/', verifyToken, validate(createConversationSchema), createConversation);
router.post('/conversations', verifyToken, validate(createConversationSchema), createConversation);

export default router;
