import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Field, FieldDescription } from '@/shared/ui/field';
import { Checkbox } from '@/shared/ui/checkbox';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData, LifecycleStage } from '@/entities/project';

const LIFECYCLE_STAGES: { value: LifecycleStage; label: string }[] = [
  { value: 'development', label: 'Development' },
  { value: 'testing', label: 'Testing' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' }
];

interface ProjectLifecycleFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectLifecycleField({ form }: ProjectLifecycleFieldProps) {
  return (
    <FormField
      control={form.control}
      name="lifecycleStages"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>Lifecycle stages</FormLabel>
            <FormControl>
              <div className="flex flex-wrap gap-4 pt-2">
                {LIFECYCLE_STAGES.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={field.value.includes(value)}
                      onCheckedChange={(checked) => {
                        const next = checked
                          ? [...field.value, value]
                          : field.value.filter((v) => v !== value);
                        field.onChange(next);
                      }}
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </FormControl>
            <FieldDescription>
              Stages through which releases can be promoted (e.g. dev → staging → production).
            </FieldDescription>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  );
}
