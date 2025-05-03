import DynamicBreadcrumbs from '@/components/dynamic-breadcrumbs';
import { auth } from '@repo/auth';
import { Separator } from '@repo/design-system/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@repo/design-system/components/ui/sidebar';
import axios from 'axios';
import type React from 'react';
import { AppSidebar } from './_components/app-sidebar';
import { VaultCheck } from './_components/vault-check';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

const UserDashboardLayout = async ({ children }: UserDashboardLayoutProps) => {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id || null;

  const hasVaults = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/user/${userId}/check-vaults`
  );

  if (!hasVaults.data.hasVaults) {
    return <VaultCheck userId={userId}>{children}</VaultCheck>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs />
          </div>
        </header>
        <main className="h-full flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default UserDashboardLayout;
