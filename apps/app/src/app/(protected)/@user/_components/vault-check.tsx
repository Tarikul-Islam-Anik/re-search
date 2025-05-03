'use client';

import { useCheckUserVaults } from '@/hooks/query/user/use-check-user-vaults';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';
import OnboardingPage from '../onboarding/page';

interface VaultCheckProps {
  userId?: string;
  children: React.ReactNode;
}

export function VaultCheck({ userId, children }: VaultCheckProps) {
  const router = useRouter();

  const { data, isLoading, error } = useCheckUserVaults(userId);

  const hasData = !!data;
  const hasVaults = hasData && data.hasVaults;
  const notOnboarding = !window.location.pathname.includes('/onboarding');

  const shouldSendToOnboarding = hasData && !hasVaults && notOnboarding;

  useEffect(() => {
    if (isLoading || !userId) {
      return;
    }

    // If we've checked and user has no vaults, redirect to onboarding
    if (shouldSendToOnboarding) {
      router.push('/onboarding');
    }
  }, [isLoading, shouldSendToOnboarding, router, userId]);

  if (isLoading) {
    // Optionally, you can show a loading spinner or placeholder here
    return (
      <div className="grid h-screen place-items-center">
        <Loader2 className="animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (shouldSendToOnboarding) {
    // Optionally, you can show a loading spinner or placeholder here
    return (
      <div className="grid h-screen place-items-center">
        <OnboardingPage />
      </div>
    );
  }

  // Don't block rendering while checking - the redirect will happen if needed
  return children;
}
