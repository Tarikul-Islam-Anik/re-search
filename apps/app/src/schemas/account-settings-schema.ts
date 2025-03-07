import { z } from 'zod';

export const accountFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please enter a valid phone number.',
  }),
  profileImage: z.instanceof(File).or(z.string()).optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
