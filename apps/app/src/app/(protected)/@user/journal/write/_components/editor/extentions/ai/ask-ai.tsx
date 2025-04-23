'use client';

import { Sparkles } from 'lucide-react';
import { BubbleMenuButton } from '../bubble-menu/bubble-menu-button';

type Props = {
  onSelect: () => void;
};

export function AskAI({ onSelect }: Props) {
  return (
    <BubbleMenuButton
      action={onSelect}
      isActive={false}
      className="flex items-center space-x-2"
    >
      <Sparkles className="size-4" />
    </BubbleMenuButton>
  );
}
