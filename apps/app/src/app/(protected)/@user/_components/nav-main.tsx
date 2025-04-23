'use client';

import { Home, Search, Sparkles } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/design-system/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navApp = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },

  {
    title: 'Search',
    url: '/search',
    icon: Search,
  },
  {
    title: 'Ask AI',
    url: '/ai-chat',
    icon: Sparkles,
  },
];

export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      {navApp.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.url}
            tooltip={item.title}
          >
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
