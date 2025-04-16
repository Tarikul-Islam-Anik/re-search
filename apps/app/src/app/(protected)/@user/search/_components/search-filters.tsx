'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Container } from '@/components/container';
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { Slider } from '@repo/design-system/components/ui/slider';
import {
  useSearchPapers,
  useSearchStore,
} from '../../../../../store/use-search-store';
import type { SearchFilters as SearchFiltersType } from './search-filter-types';

const formSchema = z.object({
  query: z.string().min(2, {
    message: 'Search query must be at least 2 characters.',
  }),
});

interface SearchInterfaceProps {
  initialQuery: string;
  filters: SearchFiltersType;
  onUpdateFilters: (filters: Partial<SearchFiltersType>) => void;
  onSearch: (query: string) => void;
}

export function SearchFilters({
  initialQuery,
  filters: propFilters,
  onUpdateFilters,
  onSearch: propOnSearch,
}: SearchInterfaceProps) {
  // Use the search store
  const { query, setQuery, filters, updateFilters } = useSearchStore();
  const { refetch } = useSearchPapers();
  const [keyword, setKeyword] = useState('');

  // Create form with the query from search store
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: query || initialQuery,
    },
  });

  // Update form when query changes
  useEffect(() => {
    form.setValue('query', query);
  }, [form, query]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setQuery(values.query);
    refetch();
  }

  const addKeyword = () => {
    if (keyword && !filters.keywords.includes(keyword)) {
      updateFilters({ keywords: [...filters.keywords, keyword] });
      setKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    updateFilters({
      keywords: filters.keywords.filter((k: string) => k !== keywordToRemove),
    });
  };

  const handleYearRangeChange = (value: number[]) => {
    updateFilters({ yearRange: [value[0], value[1]] });
  };

  const handleTopicChange = (value: string) => {
    if (!filters.topics.includes(value)) {
      updateFilters({ topics: [...filters.topics, value] });
    }
  };

  const removeTopic = (topicToRemove: string) => {
    updateFilters({
      topics: filters.topics.filter((t: string) => t !== topicToRemove),
    });
  };

  const handleJournalChange = (value: string) => {
    if (!filters.journals.includes(value)) {
      updateFilters({ journals: [...filters.journals, value] });
    }
  };

  const removeJournal = (journalToRemove: string) => {
    updateFilters({
      journals: filters.journals.filter((j: string) => j !== journalToRemove),
    });
  };

  const handleAuthorAdd = (value: string) => {
    if (value && !filters.authors.includes(value)) {
      updateFilters({ authors: [...filters.authors, value] });
      return true;
    }
    return false;
  };

  const removeAuthor = (authorToRemove: string) => {
    updateFilters({
      authors: filters.authors.filter((a: string) => a !== authorToRemove),
    });
  };

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Search Papers</SectionTitle>
          <SectionDescription>Find research papers</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="search-query">Search Query</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          id="search-query"
                          placeholder="Search query..."
                          className="flex-1"
                          {...field}
                        />
                        <Button type="submit" size="icon">
                          <Search className="h-4 w-4" />
                          <span className="sr-only">Search</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="space-y-6">
            {/* Keywords Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Keywords</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="keyword-input">Add Keyword</Label>
                    <Input
                      id="keyword-input"
                      placeholder="Add keyword..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                    />
                  </div>
                  <Button size="sm" onClick={addKeyword} className="self-end">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.keywords.map((kw: string) => (
                    <Badge
                      key={kw}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {kw}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeKeyword(kw)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Filters Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Advanced Filters</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Select onValueChange={handleTopicChange}>
                    <SelectTrigger id="topic">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">
                        Artificial Intelligence
                      </SelectItem>
                      <SelectItem value="ml">Machine Learning</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                  {filters.topics.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {filters.topics.map((topic: string) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {topic}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTopic(topic)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value;
                        if (handleAuthorAdd(value)) {
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  {filters.authors.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {filters.authors.map((author: string) => (
                        <Badge
                          key={author}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {author}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeAuthor(author)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Publication Year</Label>
                    <span className="text-muted-foreground text-sm">
                      {filters.yearRange[0]} - {filters.yearRange[1]}
                    </span>
                  </div>
                  <Slider
                    defaultValue={filters.yearRange}
                    min={1990}
                    max={2023}
                    step={1}
                    onValueChange={(value) =>
                      handleYearRangeChange(value as number[])
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="journal">Journal/Conference</Label>
                  <Select onValueChange={handleJournalChange}>
                    <SelectTrigger id="journal">
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="ieee">IEEE</SelectItem>
                      <SelectItem value="acm">ACM</SelectItem>
                      <SelectItem value="neurips">NeurIPS</SelectItem>
                    </SelectContent>
                  </Select>
                  {filters.journals.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {filters.journals.map((journal: string) => (
                        <Badge
                          key={journal}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {journal}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeJournal(journal)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              setQuery(form.getValues().query);
              refetch();
            }}
          >
            Apply Filters
          </Button>
        </SectionContent>
      </Section>
    </Container>
  );
}
