import { CodeXml } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ComponentProps, ReactNode } from 'react';
import { FieldDescription } from '@/shared/ui/field.tsx';

interface AuthLayoutProps extends ComponentProps<'div'> {
  children: ReactNode;
}

export function AuthLayout(
  {
    children,
    className,
    ...props
  }: AuthLayoutProps
) {
  return (
    <div
      className={cn(
        'bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10',
        className
      )}
      {...props}
    >
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <CodeXml className="size-4" />
          </div>
          OnlySpans
        </a>
        <div className={cn('flex flex-col gap-6', className)}>
          <>{children}</>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
            and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}

