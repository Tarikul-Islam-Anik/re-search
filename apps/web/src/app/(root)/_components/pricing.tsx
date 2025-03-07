import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { cn } from '@repo/design-system/lib/utils';
import { Check, FileText, Lightbulb, PhoneCall } from 'lucide-react';
import type { ReactNode } from 'react';

// Types
interface Feature {
  title: string;
  description: string;
}

interface PricingPlan {
  title: string;
  description: string;
  price: number;
  features: Feature[];
  ctaText: string;
  ctaIcon: ReactNode;
  ctaVariant?: 'default' | 'outline';
  highlighted?: boolean;
}

// Feature Item Component
const FeatureItem = ({ title, description }: Feature) => (
  <div className="flex flex-row gap-4">
    <Check className="mt-2 size-4 text-primary" />
    <div className="flex flex-col">
      <p>{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

// Price Card Component
const PriceCard = ({
  plan,
  className = '',
}: {
  plan: PricingPlan;
  className?: string;
}) => (
  <Card
    className={cn(
      'h-fit w-full rounded-md',
      plan.highlighted ? 'shadow-2xl' : '',
      className
    )}
  >
    <CardHeader>
      <CardTitle>
        <span className="flex flex-row items-center gap-4 font-normal">
          {plan.title}
        </span>
      </CardTitle>
      <CardDescription>{plan.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col justify-start gap-8">
        <p className="flex flex-row items-center gap-2 text-xl">
          <span className="text-4xl">${plan.price}</span>
          <span className="text-muted-foreground text-sm"> / month</span>
        </p>
        <div className="flex flex-col justify-start gap-4">
          {plan.features.map((feature, index) => (
            <FeatureItem
              key={`${plan.title}-feature-${index}`}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        <Button variant={plan.ctaVariant} className="gap-4">
          {plan.ctaText} {plan.ctaIcon}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const Pricing = () => {
  // Basic features shared across all plans
  const basicFeatures: Feature[] = [
    {
      title: 'Basic Vault System',
      description:
        'Create and manage up to 5 research vaults for your projects.',
    },
    {
      title: 'PDF Management',
      description:
        'Upload and organize your research papers with basic search capabilities.',
    },
    {
      title: 'Journaling',
      description:
        'Access to the core journaling features with rich text formatting.',
    },
  ];

  // Pro features include basic features plus these
  const proFeatures: Feature[] = [
    ...basicFeatures,
    {
      title: 'Advanced AI Features',
      description:
        'AI-powered insights, summaries, and conversation with your research.',
    },
    {
      title: 'Unlimited Vaults',
      description:
        'Create as many research vaults as you need with no limitations.',
    },
  ];

  // Enterprise features include pro features plus these
  const enterpriseFeatures: Feature[] = [
    ...proFeatures,
    {
      title: 'Team Collaboration',
      description:
        'Share vaults and research with team members and collaborate on projects.',
    },
    {
      title: 'Custom AI Models',
      description:
        'Use your own custom AI models and API keys for enhanced capabilities.',
    },
  ];

  // Pricing plan data
  const pricingPlans: PricingPlan[] = [
    {
      title: 'Student',
      description:
        'Perfect for students and individual researchers looking to organize their academic work and research projects.',
      price: 9,
      features: basicFeatures,
      ctaText: 'Start your research',
      ctaIcon: <FileText className="size-4" />,
      ctaVariant: 'outline',
    },
    {
      title: 'Researcher',
      description:
        'Designed for academic professionals and serious researchers who need advanced AI-powered tools and unlimited storage.',
      price: 29,
      features: proFeatures,
      ctaText: 'Upgrade your research',
      ctaIcon: <Lightbulb className="size-4" />,
      highlighted: true,
    },
    {
      title: 'Institution',
      description:
        'Enterprise-grade solution for research teams, labs, and academic institutions with collaboration needs.',
      price: 99,
      features: enterpriseFeatures,
      ctaText: 'Contact sales',
      ctaIcon: <PhoneCall className="size-4" />,
      ctaVariant: 'outline',
    },
  ];

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Badge>Pricing</Badge>
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-center font-regular text-3xl tracking-tighter md:text-5xl">
              Plans for every researcher
            </h2>
            <p className="max-w-xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
              Choose the plan that fits your research needs, from individual
              students to large institutions.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-8 pt-20 text-left lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <PriceCard key={`pricing-plan-${index}`} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
