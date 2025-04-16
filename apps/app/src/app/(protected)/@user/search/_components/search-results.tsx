'use client';

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
import {
  useSearchPapers,
  useSearchStore,
} from '../../../../../store/use-search-store';

export function SearchResults() {
  const { data: papers = [], isLoading, error, refetch } = useSearchPapers();
  const { selectPaper, selectedPaperId } = useSearchStore();

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
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
                  {getStatusIcon(paper.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
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
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Paper
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Mark as Read
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <BookmarkPlus className="mr-2 h-4 w-4" />
                        Add to Reading List
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Star className="mr-2 h-4 w-4" />
                        Add to Favorites
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
