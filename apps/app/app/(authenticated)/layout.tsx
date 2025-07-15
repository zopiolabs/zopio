/**
 * SPDX-License-Identifier: MIT
 */

import { env } from '@/env';
import { auth, currentUser } from '@repo/auth/server';
import { SidebarProvider } from '@repo/design-system/ui/sidebar';
import { showBetaFeature } from '@repo/feature-flags';
import { NotificationsProvider } from '@repo/notifications/components/provider';
import { secure } from '@repo/security';
import { captureException } from '@sentry/nextjs';
import type { ReactNode } from 'react';
import { PostHogIdentifier } from './components/posthog-identifier';
import { GlobalSidebar } from './components/sidebar';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    try {
      // Add timeout handling for Arcjet security check
      const securityPromise = secure(['CATEGORY:PREVIEW']);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Security check timed out')), 3000);
      });

      await Promise.race([securityPromise, timeoutPromise]).catch((error) => {
        // Log the error to Sentry with appropriate context
        captureException(error, {
          tags: { component: 'AppLayout', operation: 'securityCheck' },
          contexts: {
            additional: { message: 'Security check failed or timed out' },
          },
        });
        // Continue without blocking the user experience
      });
    } catch (error) {
      // Log the error to Sentry with appropriate context
      captureException(error, {
        tags: { component: 'AppLayout', operation: 'securityCheck' },
        contexts: { additional: { message: 'Error during security check' } },
      });
      // Continue without blocking the user experience
    }
  }

  const user = await currentUser();
  const { redirectToSignIn } = await auth();
  const betaFeature = await showBetaFeature();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <NotificationsProvider userId={user.id}>
      <SidebarProvider>
        <GlobalSidebar>
          {betaFeature && (
            <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
              Beta feature now available
            </div>
          )}
          {children}
        </GlobalSidebar>
        <PostHogIdentifier />
      </SidebarProvider>
    </NotificationsProvider>
  );
};

export default AppLayout;
