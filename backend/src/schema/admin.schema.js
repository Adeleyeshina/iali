import { z } from 'zod';

export const adminDecideSchema = {
  body: z.object({
    kind: z.enum(['job', 'verification'], { required_error: 'kind is required' }),
    targetId: z.string({ required_error: 'targetId is required' }).min(1),
    ok: z.boolean({ required_error: 'ok is required' }),
    reason: z.string().optional().default(''),
  }),
};
