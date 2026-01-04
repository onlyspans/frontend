import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/shared/ui/sonner';
import { router } from './router';
import { ThemeProvider } from '@/app/providers/theme-provider.tsx';

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
