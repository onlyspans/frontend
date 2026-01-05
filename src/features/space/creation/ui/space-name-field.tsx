import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Field } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateSpaceFormData } from '@/entities/space/model/create-space-schema';

interface SpaceNameFieldProps {
  form: UseFormReturn<CreateSpaceFormData>;
}

export function SpaceNameField({ form }: SpaceNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>Space Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="My Workspace"
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
