import JournalTimeline from './timeline/_components/journal-timeline';
import JournalTimelineLayout from './timeline/layout';

const JournalPage = () => {
  return (
    <JournalTimelineLayout>
      <JournalTimeline />
    </JournalTimelineLayout>
  );
};

JournalPage.displayName = 'JournalPage';

export default JournalPage;
