import type { Metadata } from 'next';
import type React from 'react';

interface TLDRDrawPageLayoutProps {
  children?: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'TLDR Draw',
  description: 'TLDR Draw',
};

const TLDRDrawPageLayout = ({ children }: TLDRDrawPageLayoutProps) => {
  return children;
};

TLDRDrawPageLayout.displayName = 'TLDRDrawPageLayout';

export default TLDRDrawPageLayout;
