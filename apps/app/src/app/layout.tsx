import '@repo/design-system/styles/globals.css';
import { ReactQueryProvider } from '@/context/react-query-provider';
import { DesignSystemProvider } from '@repo/design-system';
import TailwindIndicator from '@repo/design-system/components/shared/tailwind-indicator';
import { fonts } from '@repo/design-system/lib/fonts';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body>
      <ReactQueryProvider>
        <DesignSystemProvider>{children}</DesignSystemProvider>
        <Toolbar />
        <TailwindIndicator />
      </ReactQueryProvider>
    </body>
  </html>
);

export default RootLayout;
