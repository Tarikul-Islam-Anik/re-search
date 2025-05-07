import { Container } from '@/components/container';
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Manage Files',
  description: 'Manage your files in your vault',
};

const ManageFilesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Manage Files</SectionTitle>
          <SectionDescription>
            Manage your files in your vault. This is a safe space for you to
            express yourself.
          </SectionDescription>
        </SectionHeader>
        <SectionContent>{children}</SectionContent>
      </Section>
    </Container>
  );
};

export default ManageFilesLayout;
