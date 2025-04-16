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
import {
  ChevronRight,
  FileText,
  Files,
  Joystick,
  NotebookPen,
  Signature,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavApp() {
  const pathname = usePathname();

  const navAPP = [
    {
      title: 'Files',
      url: 'files',
      icon: Files,
      isActive: false,
      items: [
        {
          title: 'Upload a file',
          url: 'upload-file',
        },
        {
          title: 'Manage',
          url: 'manage',
        },
      ],
    },
    {
      title: 'Journal',
      url: 'journal',
      icon: NotebookPen,
      items: [
        {
          title: 'Write',
          url: 'write',
        },
        {
          title: 'Timeline',
          url: 'timeline',
        },
      ],
    },
    {
      title: 'Paper',
      url: 'paper',
      icon: FileText,
      items: [
        {
          title: 'Write',
          url: 'write',
        },
        {
          title: 'Manage',
          url: 'manage',
        },
      ],
    },
    {
      title: 'References',
      url: 'references',
      icon: Signature,
      items: [
        {
          title: 'Add',
          url: 'add',
        },
        {
          title: 'Manage',
          url: 'manage',
        },
      ],
    },
    {
      title: 'Tools',
      url: 'tools',
      icon: Joystick,
      items: [
        {
          title: 'Mermaid',
          url: 'mermaid',
        },
        {
          title: 'Excalidraw',
          url: 'excalidraw',
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navAPP.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.items?.some((subItem) =>
              pathname.includes(subItem.url)
            )}
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
                        isActive={pathname === `/${item.url}/${subItem.url}`}
                      >
                        <Link href={`/${item.url}/${subItem.url}`}>
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
