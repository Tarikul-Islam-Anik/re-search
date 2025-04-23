import type { Metadata } from 'next';
import type React from 'react';

interface ToolsPageProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: 'Tools',
    template: '%s | Tools',
  },
  description: 'Tools page',
};

const ToolsPage: React.FC<ToolsPageProps> = ({ children }) => {
  return children;
};

ToolsPage.displayName = 'ToolsPage';

export default ToolsPage;
