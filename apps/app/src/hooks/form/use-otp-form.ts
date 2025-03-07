'use client';

import { type OTP, otpSchema } from '@/schemas/otp-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export function useOTPForm() {
  const form = useForm<OTP>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  const isValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;
  const isDisabled = !isValid || isSubmitting;

  return { form, onSubmit, isDisabled };
}
