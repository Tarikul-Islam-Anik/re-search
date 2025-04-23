import { Container } from '@/components/container';
import type { Metadata } from 'next';
import type React from 'react';

import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';

interface WritePageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Write Journal',
  description: 'Write Journal',
};

const WritePageLayout: React.FC<WritePageLayoutProps> = ({ children }) => {
  return (
    <>
      <Container>
        <Section>
          <SectionHeader>
            <SectionTitle>Journal Entry</SectionTitle>
            <SectionDescription>
              Write your thoughts and feelings in your journal. This is a safe
              space for you to express yourself.
            </SectionDescription>
          </SectionHeader>
        </Section>
      </Container>
      {children}
    </>
  );
};

WritePageLayout.displayName = 'WritePageLayout';

export default WritePageLayout;
