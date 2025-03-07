import { env } from '@/env';
import { showBetaFeature } from '@repo/feature-flags';
import { secure } from '@repo/security';
import type { ReactNode } from 'react';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

  // const user = await currentUser();
  // const { redirectToSignIn } = await auth();
  const betaFeature = await showBetaFeature();

  // if (!user) {
  //   return redirectToSignIn();
  // }

  return (
    // <NotificationsProvider userId={user.id}>
    //   <SidebarProvider>
    //     <GlobalSidebar>
    //       {betaFeature && (
    //         <div className="m-4 rounded-full bg-success p-1.5 text-center text-sm text-success-foreground">
    //           Beta feature now available
    //         </div>
    //       )}
    children
    //     </GlobalSidebar>
    //     <PostHogIdentifier />
    //   </SidebarProvider>
    // </NotificationsProvider>
  );
};

export default AppLayout;
