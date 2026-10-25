import { z } from 'zod';

export const createConversationSchema = {
  body: z.object({
    candidateId: z.string().optional(),
    recipientId: z.string().optional(),
    recruiterId: z.string().optional(),
    subject: z.string({ required_error: 'subject is required' }).min(2, 'subject must be at least 2 characters'),
  }),
};

export const searchCandidatesSchema = {
  query: z.object({
    q: z.string().optional(),
    completeOnly: z.string().optional(),
  }),
};
