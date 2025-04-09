import { redirect } from 'next/navigation';

const AdminDashboardPage = () => {
  return redirect('/dashboard/overview');
};

export default AdminDashboardPage;
