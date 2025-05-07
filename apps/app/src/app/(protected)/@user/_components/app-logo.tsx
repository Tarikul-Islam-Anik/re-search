'use client';

import { useCheckUserVaults } from '@/hooks/query/user/use-check-user-vaults';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@repo/design-system/components/ui/sidebar';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { cn } from '@repo/design-system/lib/utils';

export function AppLogo() {
  const { state } = useSidebar();
  const { data, isLoading } = useCheckUserVaults();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="size-4"
            >
              <path
                d="M17.774 9.654L24.765 2.686L27.076 4.989L20.613 11.43L30.298 8.844L31.144 11.99L22.314 14.349L32 16.935L31.154 20.082L22.386 17.74C22.4967 17.2667 22.5523 16.7773 22.553 16.272C22.553 12.674 19.626 9.757 16.016 9.757C12.406 9.757 9.479 12.674 9.479 16.272C9.47858 16.7695 9.53529 17.2654 9.648 17.75L0 15.173L0.846 12.026L9.676 14.385L2.586 7.318L4.896 5.015L11.361 11.457L8.766 1.805L11.923 0.962L14.325 9.895L16.985 0L20.142 0.843L17.774 9.654ZM29.414 24.79L27.103 27.094L20.751 20.764C21.5485 19.9303 22.1097 18.8993 22.377 17.777L29.414 24.79ZM23.234 30.304L20.077 31.147L17.766 22.55C18.8738 22.2433 19.8811 21.6497 20.686 20.829L23.234 30.304ZM15.116 32L11.959 31.157L14.272 22.552C15.3756 22.8555 16.5392 22.8659 17.648 22.582L15.116 32ZM7.235 29.423L4.924 27.12L11.291 20.774C12.0792 21.5963 13.0685 22.1985 14.161 22.521L7.235 29.423ZM1.702 23.264L0.856 20.118L9.653 17.768C9.91461 18.8729 10.4611 19.89 11.238 20.718L1.702 23.264Z"
                fill="white"
              />
            </svg>
          </div>
          <div
            className={cn('grid flex-1 text-left text-sm leading-tight', {
              hidden: state === 'collapsed',
            })}
          >
            <span className="truncate font-semibold">Re:Search</span>
            {isLoading ? (
              <Skeleton className="h-3 w-16" />
            ) : (
              <span className="truncate text-xs">
                {data?.vaultCount ? data.vaultName : 'No Vaults'}
              </span>
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
