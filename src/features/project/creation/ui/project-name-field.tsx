import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Field } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData } from '@/entities/project';

interface ProjectNameFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectNameField({ form }: ProjectNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="My Project"
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
