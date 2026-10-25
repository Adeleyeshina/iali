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
    experience: z.any().optional(),
    education: z.any().optional(),
    photoUrl: z.string().optional().nullable(),
    cvUrl: z.string().optional().nullable(),
    cvFileName: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
  }),
};

export const parseCvSchema = {
  body: z.object({
    text: z.string().optional(),
  }),
};
