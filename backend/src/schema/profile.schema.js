import { z } from 'zod';

export const updateProfileSchema = {
  body: z.object({
    headline: z.string().optional().nullable(),
    summary: z.string().optional().nullable(),
    skills: z.array(z.string()).optional(),
    city: z.string().optional().nullable(),
    workModePref: z.enum(['onsite', 'hybrid', 'remote']).optional(),
    availability: z.string().optional().nullable(),
    contactPref: z.string().optional().nullable(),
    willingRelocate: z.boolean().optional(),
    searchable: z.boolean().optional(),
  }),
};

export const parseCvSchema = {
  body: z.object({
    text: z.string({ required_error: 'CV text is required' }).min(10, 'CV text too short'),
  }),
};
