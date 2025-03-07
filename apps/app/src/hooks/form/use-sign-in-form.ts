import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { type LoginSchema, loginSchema } from '@/schemas/sign-in-schema';

export function useSignInForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
  });

  const isLoading = form.formState.isSubmitting;
  const isValid = form.formState.isValid;
  const isDisabled = !isValid || isLoading;

  return { form, onSubmit, isLoading, isValid, isDisabled };
}
