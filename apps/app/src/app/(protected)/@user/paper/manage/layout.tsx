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
  title: 'Manage Papers',
  description: 'Manage your papers in your vault',
};

const ManagePapersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Manage Papers</SectionTitle>
          <SectionDescription>
            Manage your papers in your vault.
          </SectionDescription>
        </SectionHeader>
        <SectionContent>{children}</SectionContent>
      </Section>
    </Container>
  );
};

export default ManagePapersLayout;
