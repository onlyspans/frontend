import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { FieldGroup } from '@/shared/ui/field';
import { useTranslation } from '@/shared/lib/i18n';
import { useEventsSettings, useUpdateEventsSettings } from '@/entities/event';

const settingsSchema = z.object({
  retentionPeriodDays: z.number().int().min(1).max(3650),
  maxExportSize: z.number().int().min(1)
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function EventsSettingsCard() {
  const { t } = useTranslation();
  const settingsQuery = useEventsSettings();
  const updateMutation = useUpdateEventsSettings();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      retentionPeriodDays: 30,
      maxExportSize: 10000
    }
  });

  useEffect(() => {
    if (!settingsQuery.data) return;
    form.reset({
      retentionPeriodDays: settingsQuery.data.retentionPeriodDays,
      maxExportSize: settingsQuery.data.maxExportSize
    });
  }, [settingsQuery.data?.retentionPeriodDays, settingsQuery.data?.maxExportSize, form]);

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateMutation.mutateAsync({
        retentionPeriodDays: data.retentionPeriodDays,
        maxExportSize: data.maxExportSize
      });
      toast.success(t('pages.events.settings.updated'));
    } catch (e) {
      toast.error(t('pages.events.settings.updateFailed'), {
        description: e instanceof Error ? e.message : undefined
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.events.settings.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {settingsQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">{t('pages.events.settings.loading')}</div>
        ) : settingsQuery.isError ? (
          <div className="text-sm text-destructive">{t('pages.events.settings.loadFailed')}</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="retentionPeriodDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.events.settings.retentionDays')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={3650}
                          step={1}
                          value={field.value}
                          onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxExportSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.events.settings.maxExportSize')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          step={1}
                          value={field.value}
                          onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || updateMutation.isPending}
                  >
                    {form.formState.isSubmitting || updateMutation.isPending
                      ? t('common.saving')
                      : t('common.saveChanges')}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
