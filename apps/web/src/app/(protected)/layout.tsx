import type React from 'react';

const ProtectedPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};

export default ProtectedPageLayout;
