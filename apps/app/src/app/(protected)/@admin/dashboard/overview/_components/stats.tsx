import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { DollarSign, MailPlus, RefreshCcw, UsersRound } from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    icon: DollarSign,
    value: '$45,231.89',
    percentage: '+20.1% from last month',
  },
  {
    title: 'Subscriptions',
    icon: RefreshCcw,
    value: '+2350',
    percentage: '+180.1% from last month',
  },
  {
    title: 'Pending Requests',
    icon: MailPlus,
    value: '+2350',
    percentage: '+180.1% from last month',
  },
  {
    title: 'Total Users',
    icon: UsersRound,
    value: '+2350',
    percentage: '+180.1% from last month',
  },
];

const Stats = () => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stat.value}</div>
            <p className="mt-6 text-muted-foreground text-xs">
              {stat.percentage}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Stats;
