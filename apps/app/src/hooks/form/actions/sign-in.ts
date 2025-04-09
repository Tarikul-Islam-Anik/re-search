'use server';

import type { LoginSchema } from '@/schemas/sign-in-schema';
import { signIn } from '@repo/auth';

export async function signInAction(values: LoginSchema) {
  try {
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return {
      success: true,
      message: 'Signed in successfully',
      code: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Invalid credentials',
      code: 401,
    };
  }
}
