import { CodeXml } from 'lucide-react';
import { FieldDescription } from '@/shared/ui/field.tsx';
import { ThemeToggle } from '@/shared/ui/theme-toggle.tsx';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="bg-muted dark:bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="fixed top-4 right-4">
        <ThemeToggle variant="ghost" />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-medium text-xl"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <CodeXml className="size-4" />
          </div>
          OnlySpans
        </a>
        <div className="flex flex-col gap-6">
          <Outlet />
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
            and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
