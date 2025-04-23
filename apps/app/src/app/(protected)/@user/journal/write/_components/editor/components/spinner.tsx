import { cn } from '@repo/design-system/lib/utils';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {}

const SpinnerComponent = React.forwardRef<SVGSVGElement, SpinnerProps>(
  function Spinner({ className, ...props }, ref) {
    return (
      <Loader2 className={cn('animate-spin', className)} ref={ref} {...props} />
    );
  }
);

SpinnerComponent.displayName = 'Spinner';

export const Spinner = React.memo(SpinnerComponent);
