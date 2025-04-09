import { Container } from '@/components/container';
import { Overview } from './_components/overview';
import { RecentUsers } from './_components/recent-users';
import Stats from './_components/stats';

const OverviewPage = () => {
  return (
    <Container className="space-y-4">
      <div className="col-span-2">
        <Stats />
      </div>
      <div className="grid gap-4 xl:grid-cols-2 ">
        <Overview />
        <RecentUsers />
      </div>
    </Container>
  );
};

export default OverviewPage;
