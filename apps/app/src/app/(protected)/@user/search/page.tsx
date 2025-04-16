'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useSearchStore } from '../../../../store/use-search-store';
import { PaperDetails } from './_components/paper-details';
import { SearchFilters } from './_components/search-filters';
import { SearchResults } from './_components/search-results';

const SearchPage = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const { setQuery } = useSearchStore();

  const handleSearch = (query: string) => {
    setQuery(query);
    setHasSearched(true);
  };

  return (
    <>
      {hasSearched ? (
        <div className="grid grid-cols-1 divide-y lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          <div className="lg:col-span-1">
            <SearchFilters
              initialQuery=""
              filters={{
                keywords: [],
                topics: [],
                journals: [],
                yearRange: [1990, 2023],
                authors: [],
              }}
              onUpdateFilters={() => {}}
              onSearch={() => {}}
            />
          </div>
          <div className="h-[calc(100vh-4rem)] overflow-hidden lg:col-span-2">
            <div className="h-full overflow-y-auto">
              <SearchResults />
            </div>
          </div>
          <div className="h-[calc(100vh-4rem)] overflow-hidden lg:col-span-2">
            <div className="h-full overflow-y-auto">
              <PaperDetails />
            </div>
          </div>
        </div>
      ) : (
        <MainSearch onSearch={handleSearch} />
      )}
    </>
  );
};

SearchPage.displayName = 'SearchPage';

export default SearchPage;

function MainSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim().length > 0) {
      onSearch(query);
    }
  };

  return (
    <div className="grid min-h-[93vh] grid-cols-1 place-items-center">
      <div className="flex flex-col items-center gap-y-6">
        <h1 className="font-bold text-4xl tracking-tight">
          Discover your next favorite paper!
        </h1>
        <div className="flex w-full max-w-md gap-x-2">
          <Input
            placeholder="Search research papers..."
            className="flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
        <p className="max-w-sm text-center text-muted-foreground text-sm">
          You can search by title, author, keywords, or DOI. Try searching for
          popular topics like "machine learning" or specific technologies.
        </p>
      </div>
    </div>
  );
}
