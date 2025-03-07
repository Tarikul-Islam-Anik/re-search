import type React from 'react';

const PublicPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};

export default PublicPageLayout;
