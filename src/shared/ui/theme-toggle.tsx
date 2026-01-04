import { Moon, Sun } from 'lucide-react';
import { Button, buttonVariants } from './button';
import { useTheme } from '../hooks/use-theme';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip.tsx';
import type { VariantProps } from 'class-variance-authority';

interface ThemeToggleProps {
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

export function ThemeToggle({ variant = 'outline' }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {
            theme === 'dark'
              ? <Moon className="size-4" />
              : <Sun className="size-4" />
          }
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Toggle Theme</p>
      </TooltipContent>
    </Tooltip>
  );
}
