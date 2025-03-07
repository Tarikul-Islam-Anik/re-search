import { Button } from '@repo/design-system/components/ui/button';
import { MoveRight } from 'lucide-react';

// Define blog posts
const blogPosts = [
  {
    title: 'Getting Started with AI Research Assistants',
    description:
      'Learn how AI can revolutionize your research workflow and help you discover connections you might have missed.',
  },
  {
    title: 'The Science of Effective Note-Taking',
    description:
      'Discover proven techniques for research note-taking that enhance retention and improve the quality of your work.',
  },
  {
    title: 'Managing Literature Reviews with Re:Search',
    description:
      'How our platform can help you organize, synthesize, and analyze large volumes of academic literature efficiently.',
  },
  {
    title: "From Notes to Publication: A Researcher's Journey",
    description:
      'Case study of how one academic used Re:Search to transform scattered notes into a published paper.',
  },
];

export const Blog = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto flex flex-col gap-14">
      <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
          Research insights
        </h4>
        <Button className="gap-4">
          Browse our blog <MoveRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {blogPosts.map((post, index) => (
          <div
            key={index}
            className="flex cursor-pointer flex-col gap-2 hover:opacity-75"
          >
            <div className="mb-4 aspect-video rounded-md bg-muted" />
            <h3 className="text-xl tracking-tight">{post.title}</h3>
            <p className="text-base text-muted-foreground">
              {post.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
