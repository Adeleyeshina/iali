import { z } from 'zod';

export const signupSchema = {
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['candidate', 'recruiter', 'admin']).optional().default('candidate'),
    phone: z.string().optional().nullable(),
    consentVersion: z.string().optional().default('v1'),
    name: z.string().optional(),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
  }),
};

export const confirmSchema = {
  body: z.object({
    token: z.string({ required_error: 'Confirm token is required' }).min(1, 'Confirm token is required'),
  }),
};
