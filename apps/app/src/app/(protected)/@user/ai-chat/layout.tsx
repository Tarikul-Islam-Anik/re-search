import type { Metadata } from 'next';
import type React from 'react';

interface AIChatPageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'AI Chat',
  description: 'AI Chat',
};

const AIChatPageLayout: React.FC<AIChatPageLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

AIChatPageLayout.displayName = 'AIChatPageLayout';

export default AIChatPageLayout;
