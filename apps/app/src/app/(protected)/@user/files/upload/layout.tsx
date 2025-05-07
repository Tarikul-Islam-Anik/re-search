import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Upload File',
  description: 'Upload a file to your vault',
};

const UploadFileLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default UploadFileLayout;
