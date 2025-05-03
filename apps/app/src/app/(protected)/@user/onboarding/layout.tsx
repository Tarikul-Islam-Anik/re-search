import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Onboarding - Re:Search',
  description: 'Create your first vault to get started with Re:Search',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 place-items-center justify-center bg-background">
      {children}
    </div>
  );
}
