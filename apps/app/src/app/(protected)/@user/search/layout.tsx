import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for files in your vault',
};

const SearchLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default SearchLayout;
