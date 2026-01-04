import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Field, FieldDescription } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData } from '@/entities/project';

interface ProjectDescriptionFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectDescriptionField({ form }: ProjectDescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your project..."
                rows={4}
                className="max-h-40"
                {...field}
              />
            </FormControl>
            <FieldDescription>
              Provide a brief description of your project
            </FieldDescription>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  );
}

