import { DoiInput } from './_components/doi-input';
import { ManualEntryForm } from './_components/manual-entry-form';

const AddReferencesPage = () => {
  return (
    <div className="grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <div>
        <DoiInput />
        <div className="hidden h-full border-t bg-dashed lg:block" />
      </div>
      <ManualEntryForm />
    </div>
  );
};

AddReferencesPage.displayName = 'AddReferencesPage';

export default AddReferencesPage;
