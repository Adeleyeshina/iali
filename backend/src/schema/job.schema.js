import { z } from 'zod';

export const createJobSchema = {
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(2, 'Title must be at least 2 characters'),
    description: z.string({ required_error: 'Description is required' }).min(10, 'Description must be at least 10 characters'),
    workMode: z.enum(['onsite', 'hybrid', 'remote']).default('onsite'),
    city: z.string().optional().nullable(),
    clientName: z.string().optional().nullable(),
  }),
};

export const filterJobsSchema = {
  query: z.object({
    city: z.string().optional(),
    workMode: z.string().optional(),
    q: z.string().optional(),
    ids: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  }),
};
