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
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import {
  BookOpen,
  BookmarkPlus,
  Download,
  ExternalLink,
  FileText,
  MessageSquare,
  Share2,
  Star,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  useSearchStore,
  useSelectedPaper,
} from '../../../../../store/use-search-store';

export function PaperDetails() {
  const selectedPaperId = useSearchStore((state) => state.selectedPaperId);
  const { data: selectedPaper, isLoading: isLoadingDetails } =
    useSelectedPaper();
  const [status, setStatus] = useState<string | undefined>(
    selectedPaper?.status
  );

  // Update status whenever selected paper changes
  useEffect(() => {
    if (selectedPaper?.status) {
      setStatus(selectedPaper.status);
    }
  }, [selectedPaper]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // In a real app, you would update this in your database
  };

  if (!selectedPaperId) {
    return (
      <Container>
        <Section>
          <div className="flex h-[80vh] items-center justify-center text-center">
            <div className="max-w-sm">
              <h3 className="font-medium text-xl">
                Select a paper to view details
              </h3>
              <p className="mt-2 text-muted-foreground">
                Click on any paper in the search results to view its details
                here.
              </p>
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  if (isLoadingDetails) {
    return (
      <Container>
        <Section>
          <SectionHeader>
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-5 w-64" />
          </SectionHeader>
          <SectionContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                {['Overview', 'Authors', 'References', 'Share'].map((tab) => (
                  <Skeleton key={tab} className="h-10 w-full" />
                ))}
              </TabsList>
              <div className="mt-4 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </Tabs>
          </SectionContent>
        </Section>
      </Container>
    );
  }

  if (!selectedPaper) {
    return (
      <Container>
        <Section>
          <SectionHeader>
            <SectionTitle>Paper Details</SectionTitle>
            <SectionDescription>Error loading paper details</SectionDescription>
          </SectionHeader>
          <SectionContent>
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
              <p>Failed to load paper details</p>
              <Button variant="outline" className="mt-2">
                Try Again
              </Button>
            </div>
          </SectionContent>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Paper Details</SectionTitle>
          <SectionDescription>
            View and manage paper information
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <FileText className="mr-2 size-4 text-muted-foreground" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="authors">
                <Users className="mr-2 size-4 text-muted-foreground" />
                Authors
              </TabsTrigger>
              <TabsTrigger value="references">
                <MessageSquare className="mr-2 size-4 text-muted-foreground" />
                References
              </TabsTrigger>
              <TabsTrigger value="share">
                <Share2 className="mr-2 size-4 text-muted-foreground" />
                Share
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <div>
                <h2 className="font-bold text-2xl">{selectedPaper.title}</h2>
                <p className="mt-1 text-muted-foreground text-sm">
                  {selectedPaper.journal}, {selectedPaper.year}
                  {selectedPaper.citations
                    ? ` • ${selectedPaper.citations.toLocaleString()} citations`
                    : ''}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedPaper.keywords?.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>

              <div>
                <h3 className="mb-2 font-medium">Abstract</h3>
                <p className="text-sm">
                  {selectedPaper.abstract || 'No abstract available.'}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  className="flex-1"
                  onClick={() =>
                    selectedPaper.url &&
                    window.open(selectedPaper.url, '_blank')
                  }
                  disabled={!selectedPaper.url}
                >
                  <ExternalLink className="" />
                  View Full Paper
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    selectedPaper.pdfUrl &&
                    window.open(selectedPaper.pdfUrl, '_blank')
                  }
                  disabled={!selectedPaper.pdfUrl}
                >
                  <Download className="" />
                  Download PDF
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="authors" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-medium">Authors & Affiliations</h3>
                <div className="grid gap-2">
                  {selectedPaper.fullAuthors &&
                  selectedPaper.fullAuthors.length > 0 ? (
                    selectedPaper.fullAuthors.map((author, index) => (
                      <div
                        key={index}
                        className="flex justify-between rounded-md border p-2"
                      >
                        <div className="font-medium">{author.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {author.affiliation || 'No affiliation listed'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-md border p-2 text-center text-muted-foreground">
                      No detailed author information available
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="references" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-medium">References</h3>
                <div className="space-y-2">
                  {selectedPaper.references &&
                  selectedPaper.references.length > 0 ? (
                    selectedPaper.references.map((reference, index) => (
                      <div
                        key={index}
                        className="rounded-md border p-2 text-sm"
                      >
                        {reference}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-md border p-2 text-center text-muted-foreground">
                      No references available
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="share" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-medium">Share Paper</h3>
                <div className="grid gap-2">
                  <div className="rounded-md border p-4">
                    <p className="mb-2 text-sm">
                      Share this paper with colleagues:
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (navigator.clipboard && selectedPaper.url) {
                            navigator.clipboard.writeText(selectedPaper.url);
                          }
                        }}
                        disabled={!selectedPaper.url}
                      >
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (selectedPaper.title && selectedPaper.url) {
                            window.open(
                              `mailto:?subject=${encodeURIComponent(selectedPaper.title)}&body=${encodeURIComponent(selectedPaper.url)}`,
                              '_blank'
                            );
                          }
                        }}
                        disabled={!selectedPaper.url}
                      >
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (selectedPaper.title && selectedPaper.url) {
                            window.open(
                              `https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPaper.title)}&url=${encodeURIComponent(selectedPaper.url)}`,
                              '_blank'
                            );
                          }
                        }}
                        disabled={!selectedPaper.url}
                      >
                        Twitter
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <p className="mb-2 text-sm">Citation:</p>
                    <pre className="overflow-x-auto rounded-md bg-muted p-2 text-xs">
                      {selectedPaper.authors}, ({selectedPaper.year}).{' '}
                      {selectedPaper.title}.{' '}
                      {selectedPaper.journal
                        ? `In ${selectedPaper.journal}.`
                        : ''}
                      {selectedPaper.doi ? ` DOI: ${selectedPaper.doi}` : ''}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SectionContent>
        <div className="flex justify-between border-t pt-4">
          <div className="text-sm">
            DOI:{' '}
            {selectedPaper.doi ? (
              <a
                href={`https://doi.org/${selectedPaper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {selectedPaper.doi}
              </a>
            ) : (
              <span className="text-muted-foreground">Not available</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={status === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('read')}
            >
              <BookOpen className="" />
              Read
            </Button>
            <Button
              variant={status === 'to-read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('to-read')}
            >
              <BookmarkPlus className="" />
              To Read
            </Button>
            <Button
              variant={status === 'favorite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('favorite')}
            >
              <Star className="" />
              Favorite
            </Button>
          </div>
        </div>
      </Section>
    </Container>
  );
}
