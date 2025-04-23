import { Container } from '@/components/container';
import JournalTimeline from './_components/journal-timeline';

const TimelinePage = () => {
  return (
    <Container>
      <JournalTimeline />
    </Container>
  );
};

TimelinePage.displayName = 'TimelinePage';

export default TimelinePage;
