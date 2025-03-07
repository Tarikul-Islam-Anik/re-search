'use client';

import {
  type AccountFormValues,
  accountFormSchema,
} from '@/schemas/account-settings-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useAccountForm = () => {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  const isValid = form.formState.isValid;
  const isLoading = form.formState.isSubmitting;

  const isDisabled = !isValid || isLoading;

  return { form, onSubmit, isDisabled, isLoading };
};
