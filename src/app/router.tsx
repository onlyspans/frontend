import { createBrowserRouter } from 'react-router-dom';
import SignInPage from '@/pages/auth/sign-in-page';
import SignUpPage from '@/pages/auth/sign-up-page';
import NotFoundPage from '@/pages/not-found-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { CreateProjectPage } from '@/pages/projects/create-project-page';
import { ProjectsPage } from '@/pages/projects/projects-page';
import { ProjectPageLayout } from '@/pages/projects/project-page-layout';
import { ProjectOverviewTab } from '@/pages/projects/project-overview-tab';
import { ProjectPollingTab } from '@/pages/projects/project-polling-tab';
import { ProjectReleasesTab } from '@/pages/projects/project-releases-tab';
import { ProjectSettingsTab } from '@/pages/projects/project-settings-tab';
import { ProjectVariablesTab } from '@/pages/projects/project-variables-tab';
import { EnvironmentsPage } from '@/pages/environments/environments-page';
import { EnvironmentsVariablesPage } from '@/pages/environments/environments-variables-page';
import { MainLayout } from '@/app/layouts/main-layout';
import { AuthLayout } from '@/app/layouts/auth-layout.tsx';
import { EventsPage } from '@/pages/events/events-page';
import { ReleasesPage } from '@/pages/releases/releases-page';
import OidcCallbackPage from '@/pages/auth/oidc-callback-page';
import SilentRenewPage from '@/pages/auth/silent-renew-page';
import { RequireAuth } from '@/app/providers/require-auth';
import { appConfig } from '@/shared/config/app';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'sign-in',
        element: <SignInPage />
      },
      {
        path: 'sign-up',
        element: <SignUpPage />
      },
      ...(appConfig.auth.enabled
        ? ([
            {
              path: 'auth/callback',
              element: <OidcCallbackPage />
            },
            {
              path: 'auth/silent-renew',
              element: <SilentRenewPage />
            }
          ] as const)
        : [])
    ]
  },
  {
    element: (
      <>
        {appConfig.auth.enabled ? (
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        ) : (
          <MainLayout />
        )}
      </>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'projects',
        children: [
          {
            index: true,
            element: <ProjectsPage />
          },
          {
            path: 'create',
            element: <CreateProjectPage />
          },
          {
            path: ':slug',
            element: <ProjectPageLayout />,
            children: [
              {
                index: true,
                element: <ProjectOverviewTab />
              },
              {
                path: 'releases',
                element: <ProjectReleasesTab />
              },
              {
                path: 'polling',
                element: <ProjectPollingTab />
              },
              {
                path: 'settings',
                element: <ProjectSettingsTab />
              },
              {
                path: 'variables',
                element: <ProjectVariablesTab />
              }
            ]
          }
        ]
      },
      {
        path: 'environments',
        children: [
          {
            index: true,
            element: <EnvironmentsPage />
          },
          {
            path: 'variables',
            element: <EnvironmentsVariablesPage />
          }
        ]
      },
      {
        path: 'events',
        element: <EventsPage />
      },
      {
        path: 'releases',
        element: <ReleasesPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
