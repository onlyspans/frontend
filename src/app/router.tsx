import { createBrowserRouter, Navigate } from 'react-router-dom';
import SignInPage from '@/pages/auth/sign-in-page';
import SignUpPage from '@/pages/auth/sign-up-page';
import NotFoundPage from '@/pages/not-found-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { MainLayout } from '@/app/layouts/main-layout';
import { AuthLayout } from '@/app/layouts/auth-layout.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/sign-in" replace />
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
        path: '/dashboard',
        element: <DashboardPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
