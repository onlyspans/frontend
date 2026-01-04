import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/shared/ui/form';
import { Field, FieldTitle } from '@/shared/ui/field';
import { Button } from '@/shared/ui/button';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData } from '@/entities/project';

interface DeployToFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

const deployOptions = [
  { value: 'aws', label: 'AWS' },
  { value: 'yandex-cloud', label: 'Yandex Cloud' },
  { value: 'kubernetes', label: 'Kubernetes' }
] as const;

export function DeployToField({ form }: DeployToFieldProps) {
  return (
    <FormField
      control={form.control}
      name="deployTo"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FieldTitle>Deploy To</FieldTitle>
            <FormControl>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {deployOptions.map((option) => {
                  const isSelected = field.value === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => field.onChange(option.value)}
                      className={'w-full'}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  );
}
