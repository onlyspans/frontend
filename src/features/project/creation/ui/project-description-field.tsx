import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Field } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData } from '@/entities/project';
import { useTranslation } from '@/shared/lib/i18n';

interface ProjectDescriptionFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectDescriptionField({ form }: ProjectDescriptionFieldProps) {
  const { t } = useTranslation();
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>{t('project.creation.descriptionLabel')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('project.creation.descriptionPlaceholder')}
                rows={4}
                className="max-h-40"
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

