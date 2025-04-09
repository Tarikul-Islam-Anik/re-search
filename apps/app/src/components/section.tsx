'use client';
import { cn } from '@repo/design-system/lib/utils';
import * as React from 'react';

interface SectionContextValue {
  id?: string;
}

const SectionContext = React.createContext<SectionContextValue>({});

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  id?: string;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ children, className, id, ...props }, ref) => {
    return (
      <SectionContext.Provider value={{ id }}>
        <section
          ref={ref}
          id={id}
          className={cn('relative w-full space-y-10', className)}
          {...props}
        >
          {children}
        </section>
      </SectionContext.Provider>
    );
  }
);
Section.displayName = 'Section';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-1.5', className)} {...props}>
        {children}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ children, className, as: Comp = 'h2', ...props }, ref) => {
    const { id } = React.useContext(SectionContext);
    const titleId = id ? `${id}-title` : undefined;

    return (
      <Comp
        ref={ref}
        id={titleId}
        className={cn(
          'font-bold text-2xl leading-none tracking-tight',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
SectionTitle.displayName = 'SectionTitle';

interface SectionDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  SectionDescriptionProps
>(({ children, className, ...props }, ref) => {
  const { id } = React.useContext(SectionContext);
  const descriptionId = id ? `${id}-description` : undefined;

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn('text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
});
SectionDescription.displayName = 'SectionDescription';

interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SectionContent = React.forwardRef<HTMLDivElement, SectionContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative space-y-4', className)} {...props}>
        {children}
      </div>
    );
  }
);
SectionContent.displayName = 'SectionContent';

export {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  type SectionProps,
  type SectionHeaderProps,
  type SectionTitleProps,
  type SectionDescriptionProps,
  type SectionContentProps,
};
