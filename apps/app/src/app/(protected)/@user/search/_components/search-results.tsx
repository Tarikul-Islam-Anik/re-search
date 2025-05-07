'use client';

import { Container } from '@/components/container';
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
import { usePaperStatus } from '@/hooks/use-paper-status';
import { useSearchPapers, useSearchStore } from '@/store/use-search-store';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { cn } from '@repo/design-system/lib/utils';
import {
  BookOpen,
  BookmarkPlus,
  Download,
  ExternalLink,
  Loader2,
  MoreHorizontal,
  Star,
} from 'lucide-react';
import type { Paper } from './search-filter-types';

function PaperCard({ paper }: { paper: Paper }) {
  const { paperStatus, toggleStatus, isUpdating } = usePaperStatus(paper.id);
  const { selectPaper, selectedPaperId } = useSearchStore();

  const getStatusIcon = (currentStatus: string | undefined) => {
    switch (currentStatus) {
      case 'read':
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'to-read':
        return <BookmarkPlus className="h-4 w-4 text-blue-500" />;
      case 'favorite':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Card
      key={paper.id}
      className={cn(
        'cursor-pointer transition-colors hover:bg-muted/50',
        selectedPaperId === paper.id && 'border-primary bg-muted/70'
      )}
      onClick={() => selectPaper(paper.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{paper.title}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {paper.authors || 'Unknown Authors'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(paperStatus?.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (paper.url) {
                      window.open(paper.url, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="" />
                  View Paper
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Download className="" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus('read');
                  }}
                >
                  <BookOpen className="" />
                  {paperStatus?.status === 'read'
                    ? 'Unmark as Read'
                    : 'Mark as Read'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus('to-read');
                  }}
                >
                  <BookmarkPlus className="" />
                  {paperStatus?.status === 'to-read'
                    ? 'Remove from Reading List'
                    : 'Add to Reading List'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus('favorite');
                  }}
                >
                  <Star className="" />
                  {paperStatus?.status === 'favorite'
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-3 text-sm">
          {paper.abstract || 'No abstract available'}
        </p>
      </CardContent>
      <CardFooter className="justify-between pt-2">
        <div className="flex flex-wrap gap-1">
          {paper.keywords?.slice(0, 3).map((keyword) => (
            <Badge key={keyword} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
          {paper.keywords?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{paper.keywords.length - 3} more
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground text-sm">
          {paper.journal}, {paper.year || 'N/A'}
        </div>
      </CardFooter>
    </Card>
  );
}

export function SearchResults() {
  const { data: papers = [], isLoading, error, refetch } = useSearchPapers();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="space-y-3">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-2/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter className="justify-between">
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Card className="border-destructive/50 bg-destructive/10 text-destructive">
          <CardContent className="p-4 text-center">
            <p>Error loading results: {(error as Error).message}</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => refetch()}
            >
              Retry Search
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (papers.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="mb-2 text-muted-foreground">No results found</p>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search query or filters
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    );
  };

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Search Results</SectionTitle>
          <SectionDescription>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </span>
            ) : (
              `Found ${papers.length} papers matching your query`
            )}
          </SectionDescription>
        </SectionHeader>
        <SectionContent>{renderContent()}</SectionContent>
      </Section>
    </Container>
  );
}
