'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@repo/design-system/components/ui/sidebar';
import { ChevronRight, Gauge, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavMain() {
  const pathname = usePathname();

  const navMain = [
    {
      title: 'Dashboard',
      url: '#',
      icon: Gauge,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: 'overview',
        },
        {
          title: 'Analytics',
          url: 'analytics',
        },
      ],
    },
    {
      title: 'Users',
      url: '#',
      icon: UsersRound,
      items: [
        {
          title: 'All Users',
          url: 'users',
        },
        {
          title: 'Create User',
          url: '#',
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navMain.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === `/dashboard/${subItem.url}`}
                      >
                        <Link href={`/dashboard/${subItem.url}`}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
