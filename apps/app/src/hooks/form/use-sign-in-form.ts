import { handleApiError } from '@/lib/axios-error-handle';
import { type LoginSchema, loginSchema } from '@/schemas/sign-in-schema';
import { useUserStore } from '@/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { signInAction } from './actions/sign-in';

export function useSignInForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const fetchSessionData = async () => {
    try {
      const response = await axios.get('/api/get-session');
      // The API returns { user: {...}, expires: "..." }
      if (response.data?.user) {
        const userData = response.data.user;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image,
          role: userData.role,
        });
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching session:', error);
      handleApiError(error);
      return null;
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await signInAction(values);
      if (response.success) {
        toast.success(response.message);
        // Fetch session data and update user store after successful sign-in
        await fetchSessionData();
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
