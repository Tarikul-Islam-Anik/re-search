import { Container } from '@/components/container';
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
import { Separator } from '@repo/design-system/components/ui/separator';
import type React from 'react';

interface AddReferencesPageLayoutProps {
  children: React.ReactNode;
}
export const metadata = {
  title: 'Add References',
  description: 'Add new references to your collection',
};

const AddReferencesPageLayout = ({
  children,
}: AddReferencesPageLayoutProps) => {
  return (
    <>
      <Container>
        <Section>
          <SectionHeader>
            <SectionTitle>Add References</SectionTitle>
            <SectionDescription>
              Add new references to your collection by filling out the form
              below.
            </SectionDescription>
          </SectionHeader>
        </Section>
      </Container>
      <Separator />
      {children}
    </>
  );
};

AddReferencesPageLayout.displayName = 'AddReferencesPageLayout';

export default AddReferencesPageLayout;
