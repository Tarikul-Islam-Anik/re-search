'use client';

import { useOTPForm } from '@/hooks/form/use-otp-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';

import OTPInput from '@repo/design-system/components/shared/otp-input';
import { Button } from '@repo/design-system/components/ui/button';

export default function OTPForm() {
  const { form, onSubmit, isDisabled } = useOTPForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="p-6 md:p-8">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-bold text-2xl">Verify OTP</h1>
            <p className="text-balance text-muted-foreground">
              Enter the OTP sent to your email
            </p>
          </div>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One Time Password</FormLabel>
                <FormControl>
                  <OTPInput {...field} slotClassName="size-12" />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  The OTP is sent to your email. If you didn&apos;t receive it,
                  please check your spam folder.
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isDisabled}>
            Verify OTP
          </Button>
        </div>
      </form>
    </Form>
  );
}
