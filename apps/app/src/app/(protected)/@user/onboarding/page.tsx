'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Container } from '@/components/container';
import { useCheckUserVaults } from '@/hooks/query/user/use-check-user-vaults';
import { useUserStore } from '@/store/user';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { Textarea } from '@repo/design-system/components/ui/textarea';

const vaultSchema = z.object({
  name: z.string().min(1, 'Vault name is required'),
  description: z.string().min(1, 'Vault description is required'),
  icon: z.string().optional(),
});

type VaultFormValues = z.infer<typeof vaultSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUserStore((state) => state.user);
  const { refetch } = useCheckUserVaults(user?.id);
  const form = useForm<VaultFormValues>({
    resolver: zodResolver(vaultSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '📚',
    },
  });

  const onSubmit = async (values: VaultFormValues) => {
    if (!user?.id) {
      toast.error('User session not found');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/create`,
        {
          ...values,
          userId: user.id,
        }
      );

      if (response.status === 200) {
        toast.success('Your vault has been created!');
        // Update user's vault count in the store
        refetch();
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating vault:', error);
      toast.error('Failed to create vault. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="flex flex-col items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Re-Search</CardTitle>
          <CardDescription>
            Let's get started by creating your first vault. Vaults help you
            organize your research materials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vault Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Research Vault" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your vault a descriptive name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="This vault contains my research on..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe the purpose of this vault
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="📚" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add an emoji as an icon for your vault
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Vault...' : 'Create Vault & Continue'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            You need at least one vault to use Re-Search
          </p>
        </CardFooter>
      </Card>
    </Container>
  );
}
