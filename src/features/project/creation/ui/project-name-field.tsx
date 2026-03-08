import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Field } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData } from '@/entities/project';
import { useTranslation } from '@/shared/lib/i18n';

interface ProjectNameFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectNameField({ form }: ProjectNameFieldProps) {
  const { t } = useTranslation();
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>{t('project.creation.projectName')}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder={t('project.creation.projectNamePlaceholder')}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  );
}
