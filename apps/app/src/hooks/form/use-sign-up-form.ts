import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { type SignUpSchema, signUpSchema } from '@/schemas/sign-up-schema';

export function useSignUpForm() {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
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
