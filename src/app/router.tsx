import { createBrowserRouter, Navigate } from 'react-router-dom';
import SignInPage from '@/pages/auth/sign-in-page';
import SignUpPage from '@/pages/auth/sign-up-page';
import NotFoundPage from '@/pages/not-found-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { CreateProjectPage } from '@/pages/projects/create-project-page';
import { ProjectsPage } from '@/pages/projects/projects-page';
import { ProjectPageLayout } from '@/pages/projects/project-page-layout';
import { ProjectOverviewTab } from '@/pages/projects/project-overview-tab';
import { ProjectReleasesTab } from '@/pages/projects/project-releases-tab';
import { ProjectSettingsTab } from '@/pages/projects/project-settings-tab';
import { EnvironmentsPage } from '@/pages/environments/environments-page';
import { CreateSpacePage } from '@/pages/spaces/create-space-page';
import { MainLayout } from '@/app/layouts/main-layout';
import { AuthLayout } from '@/app/layouts/auth-layout.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/default" replace />
  },
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
      }
    ]
  },
  {
    element: <MainLayout />,
    children: [
      {
        index: false,
        path: 'spaces/create',
        element: <CreateSpacePage />
      },
      {
        path: ':spaceSlug',
        children: [
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
                    path: 'settings',
                    element: <ProjectSettingsTab />
                  }
                ]
              }
            ]
          },
          {
            path: 'environments',
            element: <EnvironmentsPage />
          },
          {
            index: true,
            element: <DashboardPage />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
