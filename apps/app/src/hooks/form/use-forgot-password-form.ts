'use client';

import {
  type ForgotPasswordSchema,
  forgotPasswordSchema,
} from '@/schemas/forgot-password-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export function useForgotPasswordForm() {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  const isValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;
  const isDisabled = !isValid || isSubmitting;

  return { form, onSubmit, isDisabled };
}
