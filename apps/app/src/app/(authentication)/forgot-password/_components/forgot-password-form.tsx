'use client';

import { useForgotPasswordForm } from '@/hooks/form/use-forgot-password-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';

import { InputWithIcon } from '@repo/design-system/components/shared/input-with-icon';
import { Button } from '@repo/design-system/components/ui/button';
import { ArrowLeftIcon, LinkIcon, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const { form, onSubmit, isDisabled } = useForgotPasswordForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="p-6 md:p-8">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-bold text-2xl">Forgot Password</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email to reset your password
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
                    placeholder="Enter your email"
                    icon={Mail}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  We will send a link to your email to reset your password.
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex w-full flex-col gap-y-2">
            <Button type="submit" className="w-full" disabled={isDisabled}>
              <LinkIcon /> <span> Send Reset Link</span>
            </Button>
            <Link href="/sign-in" className="w-full">
              <Button type="button" variant="outline" className="w-full">
                <ArrowLeftIcon /> <span> Back to Sign In</span>
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
