'use client';
import type { ChangeEvent } from 'react';
import type React from 'react';
import { useRef } from 'react';
import { cn } from '../../lib/utils';
import { Textarea } from '../ui/textarea';

interface AutoResizeTextAreaProps extends React.ComponentProps<'textarea'> {
  maxRows?: number;
}

export default function AutoResizeTextArea({
  maxRows = undefined,
  ...props
}: AutoResizeTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const defaultRows = 1;

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(e);

    const textarea = e.target;
    textarea.style.height = 'auto';

    const style = window.getComputedStyle(textarea);
    const borderHeight =
      Number.parseInt(style.borderTopWidth) +
      Number.parseInt(style.borderBottomWidth);
    const paddingHeight =
      Number.parseInt(style.paddingTop) + Number.parseInt(style.paddingBottom);

    const lineHeight = Number.parseInt(style.lineHeight);
    const maxHeight = maxRows
      ? lineHeight * maxRows + borderHeight + paddingHeight
      : Number.POSITIVE_INFINITY;

    const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
  };

  return (
    <Textarea
      ref={textareaRef}
      onChange={handleInput}
      rows={defaultRows}
      placeholder={props.placeholder}
      className={cn('min-h-[none] resize-none', props.className)}
    />
  );
}
