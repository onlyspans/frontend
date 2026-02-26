import { Button, buttonVariants } from './button';
import { useTranslation } from '@/shared/lib/i18n';
import type { SupportedLanguage } from '@/shared/lib/i18n/types.ts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip.tsx';
import type { VariantProps } from 'class-variance-authority';

const languageOrder: SupportedLanguage[] = ['en', 'ru'];
const languageFlags: Record<SupportedLanguage, string> = {
  en: 'EN',
  ru: 'RU'
};

interface LanguageToggleProps {
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

export function LanguageToggle({ variant = 'outline' }: LanguageToggleProps) {
  const { changeLanguage, currentLanguage } = useTranslation();

  const toggleLanguage = () => {
    const currentIndex = languageOrder.indexOf(currentLanguage as SupportedLanguage);
    const nextIndex = (currentIndex + 1) % languageOrder.length;
    const newLanguage = languageOrder[nextIndex];
    changeLanguage(newLanguage);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          onClick={toggleLanguage}
          size='icon'
        >
          {languageFlags[currentLanguage as SupportedLanguage] || '🌐'}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Language Toggle</p>
      </TooltipContent>
    </Tooltip>
  );
}
