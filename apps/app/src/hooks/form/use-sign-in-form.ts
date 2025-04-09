import { handleApiError } from '@/lib/axios-error-handle';
import { type LoginSchema, loginSchema } from '@/schemas/sign-in-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { signInAction } from './actions/sign-in';

export function useSignInForm() {
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await signInAction(values);
      if (response.success) {
        toast.success(response.message);
        router.push('/');
      } else {
        toast.error(response.message);
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
