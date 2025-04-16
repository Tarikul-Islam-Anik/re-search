import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Write Paper',
  description: 'Write your paper using LaTeX editor',
};

interface PaperWritePageLayoutProps {
  children: React.ReactNode;
}
const PaperWritePageLayout = ({ children }: PaperWritePageLayoutProps) => {
  return children;
};

PaperWritePageLayout.displayName = 'PaperWritePageLayout';

export default PaperWritePageLayout;
