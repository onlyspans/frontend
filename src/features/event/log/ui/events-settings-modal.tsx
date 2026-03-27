import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { InputStepper } from '@/shared/ui/input-stepper';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { FieldGroup } from '@/shared/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { useTranslation } from '@/shared/lib/i18n';
import { useEventsSettings, useUpdateEventsSettings } from '@/entities/event';

const settingsSchema = z.object({
  retentionPeriodDays: z.number().int().min(1).max(3650),
  maxExportSize: z.number().int().min(1)
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface EventsSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventsSettingsModal({ open, onOpenChange }: EventsSettingsModalProps) {
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
      onOpenChange(false);
    } catch (e) {
      toast.error(t('pages.events.settings.updateFailed'), {
        description: e instanceof Error ? e.message : undefined
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('pages.events.settings.title')}</DialogTitle>
          <DialogDescription>{t('pages.events.settings.description')}</DialogDescription>
        </DialogHeader>

        {settingsQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">{t('pages.events.settings.loading')}</div>
        ) : settingsQuery.isError ? (
          <div className="text-sm text-destructive">{t('pages.events.settings.loadFailed')}</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="retentionPeriodDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.events.settings.retentionDays')}</FormLabel>
                      <FormControl>
                        <InputStepper
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          inputRef={field.ref}
                          min={1}
                          max={3650}
                          step={1}
                          disabled={updateMutation.isPending}
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
                        <InputStepper
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          inputRef={field.ref}
                          min={1}
                          step={1}
                          disabled={updateMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting || updateMutation.isPending}>
                  {form.formState.isSubmitting || updateMutation.isPending
                    ? t('common.saving')
                    : t('common.saveChanges')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
