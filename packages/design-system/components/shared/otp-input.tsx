'use client';

import { cn } from '@keyport/design-system/lib/utils';
import { OTPInput as OTPInputComponent, type SlotProps } from 'input-otp';
import { Minus } from 'lucide-react';

interface OTPInputProps {
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
  slotClassName?: string;
  containerClassName?: string;
}

export default function OTPInput({
  maxLength = 6,
  slotClassName,
  containerClassName,
  ...props
}: OTPInputProps) {
  return (
    <OTPInputComponent
      {...props}
      maxLength={maxLength}
      containerClassName={cn(
        'flex items-center gap-3 has-[:disabled]:opacity-50',
        containerClassName
      )}
      render={({ slots }) => (
        <>
          <div className="flex">
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={idx} {...slot} className={slotClassName} />
            ))}
          </div>

          <div className="text-muted-foreground/80">
            <Minus size={16} strokeWidth={2} aria-hidden="true" />
          </div>

          <div className="flex">
            {slots.slice(3).map((slot, idx) => (
              <Slot key={idx} {...slot} className={slotClassName} />
            ))}
          </div>
        </>
      )}
    />
  );
}

interface CustomSlotProps extends SlotProps {
  char: string | null;
  isActive: boolean;
  className?: string;
}

function Slot({ char, isActive, className }: CustomSlotProps) {
  return (
    <div
      className={cn(
        '-ms-px relative flex size-9 items-center justify-center border border-input bg-background font-medium text-foreground shadow-black/5 shadow-sm transition-shadow first:ms-0 first:rounded-s-lg last:rounded-e-lg',
        { 'z-10 border border-ring ring-[3px] ring-ring/20': isActive },
        className
      )}
    >
      {char !== null && <div>{char}</div>}
    </div>
  );
}
