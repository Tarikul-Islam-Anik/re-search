import type { Metadata } from 'next';
import type React from 'react';
interface ReferencesLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'References',
  description: 'References',
};

const ReferencesLayout = ({ children }: ReferencesLayoutProps) => {
  return <>{children}</>;
};

ReferencesLayout.displayName = 'ReferencesLayout';

export default ReferencesLayout;
