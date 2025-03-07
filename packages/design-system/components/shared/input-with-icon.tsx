import type { LucideIcon } from 'lucide-react';
import React from 'react';

import { Input } from '../ui/input';

interface InputWithIconProps extends React.ComponentProps<'input'> {
  icon: LucideIcon;
}

export const InputWithIcon = React.forwardRef<
  HTMLInputElement,
  InputWithIconProps
>(({ icon, ...props }, ref) => {
  const Icon = icon;
  return (
    <div className="relative">
      <Input ref={ref} className="peer ps-10" {...props} />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
      </div>
    </div>
  );
});

InputWithIcon.displayName = 'InputWithIcon';
