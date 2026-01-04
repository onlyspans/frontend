import { useEffect, useState } from 'react';
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
import { projectApi, type ProjectLifecycle } from '@/entities/project';
import { toast } from 'sonner';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData } from '@/entities/project';

interface ProjectLifecycleFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectLifecycleField({ form }: ProjectLifecycleFieldProps) {
  const [lifecycles, setLifecycles] = useState<ProjectLifecycle[]>([]);

  // Load lifecycles
  useEffect(() => {
    projectApi.getLifecycles().then(setLifecycles).catch((error) => {
      toast.error('Failed to load lifecycles', {
        description: error.message
      });
    });
  }, []);

  return (
    <FormField
      control={form.control}
      name="lifecycleId"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>Project Lifecycle</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a lifecycle" />
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
