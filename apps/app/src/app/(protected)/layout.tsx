import { auth } from '@repo/auth';
import { redirect } from 'next/navigation';
import type React from 'react';

interface ProtectedLayoutProps {
  user: React.ReactNode;
  admin: React.ReactNode;
}

const ProtectedLayout = async ({ user, admin }: ProtectedLayoutProps) => {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  const isAdmin = session.user?.role === 'admin';

  if (isAdmin) {
    return <div>{admin}</div>;
  }

  return <div>{user}</div>;
};

export default ProtectedLayout;
