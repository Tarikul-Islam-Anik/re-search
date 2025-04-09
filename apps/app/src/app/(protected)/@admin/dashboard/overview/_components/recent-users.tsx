import { database } from '@repo/database';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { format } from 'date-fns';

const getInitials = (name: string | null) => {
  if (!name) {
    return '';
  }
  const names = name.split(' ');
  return names
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export async function RecentUsers() {
  const users = await database.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((user) => (
          <div className="flex items-center" key={user.id}>
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="font-medium text-sm leading-none">
                {user?.name ?? ''}
              </p>
              <p className="text-muted-foreground text-sm">
                {user?.email ?? ''}
              </p>
            </div>
            <div className="ml-auto font-medium text-muted-foreground text-sm">
              {format(user?.createdAt, 'PPP')}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
