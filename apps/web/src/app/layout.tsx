import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteFooter } from './_components/site-footer';
import { SiteHeader } from './_components/site-header';
type RootLayoutProperties = {
  readonly children: ReactNode;
};

export const metadata: Metadata = {
  title: 'Re:Search',
  description: 'Re:Search',
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html
    lang="en"
    className={cn(fonts, 'scroll-smooth')}
    suppressHydrationWarning
  >
    <body>
      <DesignSystemProvider>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </DesignSystemProvider>
    </body>
  </html>
);

export default RootLayout;
