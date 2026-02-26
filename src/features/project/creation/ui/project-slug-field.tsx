import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Field } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData } from '@/entities/project';
import { useTranslation } from '@/shared/lib/i18n';

interface ProjectSlugFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

function normalizeSlugInput(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ProjectSlugField({ form }: ProjectSlugFieldProps) {
  const { t } = useTranslation();
  return (
    <FormField
      control={form.control}
      name="slug"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>{t('project.creation.urlSlug')}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder={t('project.creation.urlSlugPlaceholder')}
                {...field}
                onChange={(e) => {
                  field.onChange(normalizeSlugInput(e.target.value));
                }}
              />
            </FormControl>
            <FormDescription>
              {t('project.creation.slugHint')}
            </FormDescription>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  );
}
