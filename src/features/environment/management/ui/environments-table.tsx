import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  type SensorDescriptor
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { Environment } from '@/entities/environment';
import { useTranslation } from '@/shared/lib/i18n';
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
  onReorder,
  onEdit,
  onDelete
}: {
  environmentsQuery: UseQueryResult<Environment[], unknown>;
  orderedEnvironments: Environment[];
  dndSensors: SensorDescriptor<Record<string, unknown>>[];
  onReorder: (activeId: string, overId: string) => void | Promise<void>;
  onEdit: (env: Environment) => void;
  onDelete: (env: Environment) => void;
}) {
  const { t } = useTranslation();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    onReorder(String(active.id), String(over.id));
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
    <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
      </SortableContext>
    </DndContext>
  );
}
