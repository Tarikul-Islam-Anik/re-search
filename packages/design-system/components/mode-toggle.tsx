'use client';

import { LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { SwatchBook } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../components/ui/dropdown-menu';

const themes = [
  { label: 'Light', value: 'light', icon: <SunIcon /> },
  { label: 'Dark', value: 'dark', icon: <MoonIcon /> },
  { label: 'System', value: 'system', icon: <LaptopIcon /> },
];

export const ModeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SwatchBook /> <span>Theme</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => setTheme(theme.value)}
            >
              {theme.icon} {theme.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
