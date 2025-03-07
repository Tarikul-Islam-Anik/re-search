import { Badge } from '@repo/design-system/components/ui/badge';
import { BookText, FileText, MessageSquareText, PenTool } from 'lucide-react';

export const Features = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <div>
            <Badge>Features</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
              Research Management Reimagined
            </h2>
            <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
              Re:Search combines powerful features for researchers, students,
              and academics to manage their research workflow effectively.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2 lg:aspect-auto">
            <BookText className="size-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">The Vault System</h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Create dedicated vaults for each research project to securely
                manage files, notes, and related writings in one organized
                space.
              </p>
            </div>
          </div>
          <div className="flex aspect-square flex-col justify-between rounded-md bg-muted p-6">
            <FileText className="size-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">PDF Management</h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Upload, organize, and interact with your research papers and
                documents with our advanced PDF management system.
              </p>
            </div>
          </div>

          <div className="flex aspect-square flex-col justify-between rounded-md bg-muted p-6">
            <PenTool className="size-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">Advanced Journaling</h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Create multiple journals with rich text formatting, media
                attachments, and LaTex support for mathematical expressions.
              </p>
            </div>
          </div>
          <div className="flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2 lg:aspect-auto">
            <MessageSquareText className="size-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                AI-Enhanced Interaction
              </h3>
              <p className="max-w-xs text-base text-muted-foreground">
                Chat with your journal entries, talk to your PDFs, and generate
                insights with our suite of AI tools powered by GPT-4, Claude,
                and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
