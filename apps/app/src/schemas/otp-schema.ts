import { z } from 'zod';

export const otpSchema = z.object({
  otp: z.string().length(6),
});

export type OTP = z.infer<typeof otpSchema>;
