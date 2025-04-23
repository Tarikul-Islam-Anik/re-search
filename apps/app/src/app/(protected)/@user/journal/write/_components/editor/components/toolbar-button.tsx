import { Button } from '@repo/design-system/components/ui/button';
import type { buttonVariants } from '@repo/design-system/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { cn } from '@repo/design-system/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

export interface ToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  tooltip?: string;
  isActive?: boolean;
  pressed?: boolean;
  children?: React.ReactNode;
}

export const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(
  (
    {
      className,
      variant = 'ghost',
      size = 'sm',
      tooltip,
      isActive,
      pressed,
      children,
      ...props
    },
    ref
  ) => {
    const button = (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        data-active={isActive}
        aria-pressed={pressed}
        className={cn(
          'transition-colors',
          isActive && 'bg-accent text-accent-foreground',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );

    if (!tooltip) {
      return button;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
);

ToolbarButton.displayName = 'ToolbarButton';
