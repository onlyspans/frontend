import { Palette } from 'lucide-react';
import { Button, buttonVariants } from './button';
import { useTheme, type ColorScheme } from '../hooks/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './dropdown-menu';
import type { VariantProps } from 'class-variance-authority';

interface ColorSchemeToggleProps {
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

const colorSchemes: { value: ColorScheme; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'violet', label: 'Violet' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Red' }
];

export function ColorSchemeToggle({ variant = 'outline' }: ColorSchemeToggleProps) {
  const { setColorScheme, colorScheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon">
          <Palette className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {colorSchemes.map((scheme) => (
          <DropdownMenuItem
            key={scheme.value}
            onClick={() => setColorScheme(scheme.value)}
            className={colorScheme === scheme.value ? 'bg-accent' : ''}
          >
            {scheme.label}
            {colorScheme === scheme.value && (
              <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

