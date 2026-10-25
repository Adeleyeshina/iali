import { z } from 'zod';

export const createConversationSchema = {
  body: z.object({
    candidateId: z.string().optional(),
    recipientId: z.string().optional(),
    recruiterId: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
  }).refine((data) => data.candidateId || data.recipientId || data.recruiterId, {
    message: 'Recipient ID is required',
  }).refine((data) => (data.message && data.message.trim().length > 0) || (data.subject && data.subject.trim().length > 0), {
    message: 'Message cannot be empty',
  }),
};

export const searchCandidatesSchema = {
  query: z.object({
    q: z.string().optional(),
    completeOnly: z.string().optional(),
  }),
};
