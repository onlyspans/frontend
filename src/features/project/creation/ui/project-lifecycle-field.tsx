import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Field, FieldDescription } from '@/shared/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { useLifecycles } from '@/entities/lifecycle';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData } from '@/entities/project';

interface ProjectLifecycleFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectLifecycleField({ form }: ProjectLifecycleFieldProps) {
  const { data: lifecycles = [], isLoading } = useLifecycles();

  return (
    <FormField
      control={form.control}
      name="lifecycleId"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>Project Lifecycle</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoading ? 'Loading...' : 'Select a lifecycle'} />
                </SelectTrigger>
                <SelectContent>
                  {lifecycles.map((lifecycle) => (
                    <SelectItem key={lifecycle.id} value={lifecycle.id}>
                      <div className="flex flex-row gap-2 items-center">
                        <span>{lifecycle.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {lifecycle.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FieldDescription>
              The lifecycle defines how releases can be promoted between
              environments. Create or modify lifecycles.
            </FieldDescription>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  );
}
