'use client';

import { useSignInForm } from '@/hooks/form/use-sign-in-form';
import { InputWithIcon } from '@repo/design-system/components/shared/input-with-icon';
import PasswordInput from '@repo/design-system/components/shared/password-input';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import SSO from './sso';

export function SignInForm() {
  const { form, onSubmit, isLoading, isDisabled } = useSignInForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-bold text-2xl">Welcome back</h1>
            <p className="text-balance text-muted-foreground">
              Login to your Re:Search account
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon={Mail}
                    placeholder="m@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-muted-foreground text-xs underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isDisabled}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <SSO />
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
