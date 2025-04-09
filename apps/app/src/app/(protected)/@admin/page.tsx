'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminDashboardPage from './dashboard/page';

const AdminPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return <AdminDashboardPage />;
};

export default AdminPage;
