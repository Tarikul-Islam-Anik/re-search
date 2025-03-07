'use client';

import { useSignUpForm } from '@/hooks/form/use-sign-up-form';
import { InputWithIcon } from '@repo/design-system/components/shared/input-with-icon';
import SignUpPasswordInput from '@repo/design-system/components/shared/sign-up-password-input';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Mail, User } from 'lucide-react';
import Link from 'next/link';

export function SignUpForm() {
  const { form, onSubmit, isLoading, isDisabled } = useSignUpForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="p-6 md:p-8">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-bold text-2xl">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Let&apos;s get you started!
            </p>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon={User}
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <SignUpPasswordInput
                    password={field.value}
                    setPassword={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isDisabled}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
