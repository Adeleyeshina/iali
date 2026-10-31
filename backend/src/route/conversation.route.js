import { Router } from 'express';
import {
  searchCandidates,
  getCandidateProfile,
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

// Candidate Search & Profile for Recruiters & Admins
router.get('/search/candidates', verifyToken, roleRequired('recruiter', 'admin'), validate(searchCandidatesSchema), searchCandidates);
router.get('/candidates/:userId', verifyToken, roleRequired('recruiter', 'admin'), getCandidateProfile);

// Conversation routes supporting both root and explicit subpath
router.get('/', verifyToken, getMyConversations);
router.get('/conversations', verifyToken, getMyConversations);
router.post('/', verifyToken, validate(createConversationSchema), createConversation);
router.post('/conversations', verifyToken, validate(createConversationSchema), createConversation);

export default router;
