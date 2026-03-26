import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  type SensorDescriptor
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { Environment } from '@/entities/environment';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import type { UseQueryResult } from '@tanstack/react-query';
import { SortableEnvironmentRow } from './sortable-environment-row';

export function EnvironmentsTable({
  environmentsQuery,
  orderedEnvironments,
  dndSensors,
  reorderMode,
  hasDraftReorderChanges,
  onEnterReorderMode,
  onDraftReorder,
  onSaveReorder,
  onCancelReorder,
  onEdit,
  onDelete
}: {
  environmentsQuery: UseQueryResult<Environment[], unknown>;
  orderedEnvironments: Environment[];
  dndSensors: SensorDescriptor<Record<string, unknown>>[];
  reorderMode: boolean;
  hasDraftReorderChanges: boolean;
  onEnterReorderMode: () => void;
  onDraftReorder: (activeId: string, overId: string) => void;
  onSaveReorder: () => void | Promise<void>;
  onCancelReorder: () => void;
  onEdit: (env: Environment) => void;
  onDelete: (env: Environment) => void;
}) {
  const { t } = useTranslation();

  const handleDragStart = (_event: DragStartEvent) => {
    onEnterReorderMode();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    onDraftReorder(String(active.id), String(over.id));
  };

  if (environmentsQuery.isLoading) {
    return <div className="text-sm text-muted-foreground">{t('pages.environments.table.loading')}</div>;
  }

  if (environmentsQuery.isError) {
    return <div className="text-sm text-destructive">{t('pages.environments.table.loadFailed')}</div>;
  }

  if (orderedEnvironments.length === 0) {
    return <div className="text-sm text-muted-foreground">{t('pages.environments.table.empty')}</div>;
  }

  return (
    <DndContext
      sensors={dndSensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={orderedEnvironments.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>{t('pages.environments.table.name')}</TableHead>
                <TableHead>{t('pages.environments.table.description')}</TableHead>
                <TableHead className="w-[120px] text-right pr-4">
                  {t('pages.environments.table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedEnvironments.map((env) => (
                <SortableEnvironmentRow
                  key={env.id}
                  environment={env}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {reorderMode && (
          <div className="mt-3 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancelReorder}>
              {t('pages.environments.reorder.cancel')}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" disabled={!hasDraftReorderChanges}>
                  {t('pages.environments.reorder.save')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('pages.environments.reorder.confirm.title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('pages.environments.reorder.confirm.description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('pages.environments.reorder.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={onSaveReorder}>
                    {t('pages.environments.reorder.confirm.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </SortableContext>
    </DndContext>
  );
}
