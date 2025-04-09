import { Container } from '@/components/container';
import { Chart01 } from './_components/chart-01';
import { Chart02 } from './_components/chart-02';
import { Chart03 } from './_components/chart-03';
import { Chart04 } from './_components/chart-04';
import { Chart05 } from './_components/chart-05';
import { Chart06 } from './_components/chart-06';

const AnalyticsPage = () => {
  return (
    <Container>
      <div className="grid auto-rows-min gap-4 xl:grid-cols-2">
        <Chart01 />
        <Chart02 />
        <Chart03 />
        <Chart04 />
        <Chart05 />
        <Chart06 />
      </div>
    </Container>
  );
};

export default AnalyticsPage;
