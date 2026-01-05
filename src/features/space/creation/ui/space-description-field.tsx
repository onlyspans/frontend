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
import type { CreateSpaceFormData } from '@/entities/space/model/create-space-schema';

interface SpaceDescriptionFieldProps {
  form: UseFormReturn<CreateSpaceFormData>;
}

export function SpaceDescriptionField({ form }: SpaceDescriptionFieldProps) {
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
                placeholder="Describe your space..."
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
