import { Container } from '@/components/container';
import type { Metadata } from 'next';
import type React from 'react';

import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';

interface WritePageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Journal Timeline',
  description:
    'Write your thoughts and feelings in your journal. This is a safe space for you to express yourself.',
};

const JournalTimelineLayout: React.FC<WritePageLayoutProps> = ({
  children,
}) => {
  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Journal Timeline</SectionTitle>
          <SectionDescription>
            Write your thoughts and feelings in your journal. This is a safe
            space for you to express yourself.
          </SectionDescription>
        </SectionHeader>
        <SectionContent>{children}</SectionContent>
      </Section>
    </Container>
  );
};

JournalTimelineLayout.displayName = 'WritePageLayout';

export default JournalTimelineLayout;
