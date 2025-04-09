'use client';
import { Container } from '@/components/container';

import { useGetManyUsers } from '@/hooks/query/user/use-get-many-users';
import UsersDataTable from './user-table/users-data-table';

const Users = () => {
  const { data, isLoading, error } = useGetManyUsers();

  const users = data ?? [];

  return (
    <Container className="space-y-4">
      <div className="space-y-1.5">
        <h2 className="font-bold text-2xl">Users</h2>
        <p className="text-muted-foreground text-sm">
          This is a list of your users.
        </p>
      </div>
      <UsersDataTable data={users} isLoading={isLoading} error={error} />
    </Container>
  );
};

export default Users;
