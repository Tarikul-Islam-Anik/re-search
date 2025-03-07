import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter'),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
