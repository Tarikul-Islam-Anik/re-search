import { cn } from '@repo/design-system/lib/utils';
import { type HTMLAttributes, forwardRef } from 'react';

interface TypographyProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'prose';
}

const Typography = forwardRef<HTMLDivElement, TypographyProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        className={cn(
          variant === 'prose' &&
            'prose prose-gray dark:prose-invert max-w-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Typography.displayName = 'Typography';

export { Typography };
