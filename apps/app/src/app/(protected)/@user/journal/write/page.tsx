import Editor from './_components/editor';
import JournalDetails from './_components/journal-details';

const JournalWritePage = () => {
  return (
    <div className="grid grid-cols-1 divide-y border-t lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <Editor
        placeholder="Write your thoughts here..."
        editorClassName="p-4 sm:px-6 lg:px-8 min-h-[73.5vh]"
      />
      <JournalDetails />
    </div>
  );
};

JournalWritePage.displayName = 'JournalWritePage';

export default JournalWritePage;
