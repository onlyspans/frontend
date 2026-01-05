import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Field } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateSpaceFormData } from '@/entities/space/model/create-space-schema';

interface SpaceSlugFieldProps {
  form: UseFormReturn<CreateSpaceFormData>;
}

export function SpaceSlugField({ form }: SpaceSlugFieldProps) {
  return (
    <FormField
      control={form.control}
      name="slug"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>Space Slug</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="my-workspace"
                {...field}
                onChange={(e) => {
                  const value = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-_]/g, '');
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  );
}
