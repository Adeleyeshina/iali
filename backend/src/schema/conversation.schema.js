import { z } from 'zod';

export const createConversationSchema = {
  body: z.object({
    candidateId: z.string({ required_error: 'candidateId is required' }).uuid('Invalid candidateId'),
    subject: z.string({ required_error: 'subject is required' }).min(3, 'subject must be at least 3 characters'),
  }),
};

export const searchCandidatesSchema = {
  query: z.object({
    q: z.string().optional(),
  }),
};
