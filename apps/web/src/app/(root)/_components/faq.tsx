import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { MessageSquare } from 'lucide-react';

// Define FAQ items
const faqItems = [
  {
    question: 'What is Re:Search?',
    answer:
      'Re:Search is a platform designed to empower researchers, students, and anyone engaged in research or journaling by integrating AI-powered journaling with advanced research management capabilities. It helps you capture, organize, and synthesize ideas and research findings.',
  },
  {
    question: 'How does the Vault System work?',
    answer:
      'The Vault System allows you to create dedicated vaults for each research project to securely manage files, notes, and related writings in one organized space. You can upload PDFs, create journals, and manage references all within your vaults.',
  },
  {
    question: 'What AI capabilities does Re:Search offer?',
    answer:
      'Re:Search integrates with OpenAI, GPT-4, Claude, and HuggingFace to provide AI-powered features like conversational journaling, AI writing assistance, PDF chat interfaces, and literature review automation. You can also use your own API keys.',
  },
  {
    question: 'Can I collaborate with others on my research?',
    answer:
      'Yes, our Institution plan offers team collaboration features that allow you to share vaults and research with team members and collaborate on projects together.',
  },
  {
    question: 'How is the citation management different from other tools?',
    answer:
      'Our citation management system is fully integrated with your research workflow. You can add references manually, import from various formats, and automatically cite papers you discover through our search interface. All citations can be exported in multiple formats.',
  },
  {
    question: 'Does Re:Search support LaTeX for mathematical equations?',
    answer:
      'Yes, our journaling system includes full LaTeX editor support, making it perfect for researchers working with mathematical equations and scientific notation.',
  },
];

export const FAQ = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div>
              <Badge variant="outline">FAQ</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                Frequently Asked Questions
              </h4>
              <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
                Get answers to common questions about Re:Search and how it can
                transform your research workflow. If you don't find what you're
                looking for, reach out to our team.
              </p>
            </div>
            <div className="">
              <Button className="gap-4" variant="outline">
                Ask us anything <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`index-${index}`}
              className="rounded-md border bg-background px-4 py-1 outline-none last:border-b has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
            >
              <AccordionTrigger className="justify-between gap-3 py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="ps-7 pb-2 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </div>
);
