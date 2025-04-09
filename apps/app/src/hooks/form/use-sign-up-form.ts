'use client';

import { handleApiError } from '@/lib/axios-error-handle';
import { type SignUpSchema, signUpSchema } from '@/schemas/sign-up-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function useSignUpForm() {
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/user/create`,
        values
      );

      if (response.status === 201) {
        toast.success('Account created successfully');
        router.push('/login');
      } else {
        const message = response.data?.message || 'Unknown error';
        toast.error(`Failed to create account: ${message}`);
      }
    } catch (error) {
      handleApiError(error);
    }
  });

  const isLoading = form.formState.isSubmitting;
  const isValid = form.formState.isValid;
  const isDisabled = !isValid || isLoading;

  return { form, onSubmit, isLoading, isValid, isDisabled };
}
