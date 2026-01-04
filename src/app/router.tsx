import { createBrowserRouter, Navigate } from 'react-router-dom';
import SignInPage from '@/pages/auth/sign-in-page';
import SignUpPage from '@/pages/auth/sign-up-page';
import NotFoundPage from '@/pages/not-found-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { CreateProjectPage } from '@/pages/projects/create-project-page';
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
        path: '/:spaceSlug',
        children: [
          {
            path: 'projects/create',
            element: <CreateProjectPage />
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
