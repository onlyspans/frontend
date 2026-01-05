import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/shared/ui/sonner';
import { router } from './router';
import { ThemeProvider } from '@/app/providers/theme-provider.tsx';
import { QueryProvider } from '@/app/providers/query-provider.tsx';

export function App() {
  return (
    <ThemeProvider defaultTheme="light" defaultColorScheme='default'>
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  );
}
