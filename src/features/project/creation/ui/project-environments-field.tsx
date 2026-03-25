import { useEffect } from 'react';
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
import type { CreateProjectFormData } from '@/entities/project';
import { useEnvironments } from '@/entities/environment';

interface ProjectEnvironmentsFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectEnvironmentsField({ form }: ProjectEnvironmentsFieldProps) {
  const environmentsQuery = useEnvironments();

  function normalizeIds(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return [];
  }

  useEffect(() => {
    if (!environmentsQuery.data?.length) return;
    const current = normalizeIds(form.getValues('environmentIds'));
    if (current.length > 0) return;
    form.setValue('environmentIds', [environmentsQuery.data[0].id], {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: true
    });
  }, [environmentsQuery.data, form]);

  return (
    <FormField
      control={form.control}
      name="environmentIds"
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormLabel>Environments</FormLabel>
            <FormControl>
              <div className="flex flex-wrap gap-4 pt-2">
                {environmentsQuery.isLoading ? (
                  <span className="text-sm text-muted-foreground">Loading…</span>
                ) : environmentsQuery.data?.length ? (
                  environmentsQuery.data.map((env) => (
                    <label
                      key={env.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={normalizeIds(field.value).includes(env.id)}
                        onCheckedChange={(checked) => {
                          const current = normalizeIds(field.value);
                          const next = checked === true
                            ? Array.from(new Set([...current, env.id]))
                            : current.filter((id) => id !== env.id);
                          field.onChange(next);
                        }}
                      />
                      <span className="text-sm">{env.name}</span>
                    </label>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No environments found</span>
                )}
              </div>
            </FormControl>
            <FieldDescription>
              Environments define the promotion pipeline for releases.
            </FieldDescription>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  );
}
