import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Environment } from '@/entities/environment';
import {
  useCreateEnvironment,
  useDeleteEnvironment,
  useEnvironments,
  useReorderEnvironments,
  useUpdateEnvironment
} from '@/entities/environment';
import { useTranslation } from '@/shared/lib/i18n';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel
} from '@/shared/ui/alert-dialog';

function getNextPosition(environments: Environment[] | undefined): number {
  if (!environments?.length) return 0;
  return Math.max(...environments.map((e) => e.position)) + 1;
}

function normalizeDescription(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function SortableEnvironmentRow({
                                  environment,
                                  onEdit,
                                  onDelete
                                }: {
  environment: Environment;
  onEdit: (env: Environment) => void;
  onDelete: (env: Environment) => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: environment.id });

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        isDragging && 'bg-muted/60'
      )}
    >
      <TableCell className="w-10">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          ref={setActivatorNodeRef}
          className="cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </Button>
      </TableCell>
      <TableCell className="font-medium">{environment.name}</TableCell>
      <TableCell className="min-w-[280px] whitespace-normal">
        {environment.description ?? <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell className="w-24 text-muted-foreground">{environment.position}</TableCell>
      <TableCell className="w-[120px]">
        <div className="flex items-center justify-end gap-1">
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onEdit(environment)}>
            <Pencil className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onDelete(environment)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </TableCell>
    </tr>
  );
}

export function EnvironmentsManagement() {
  const { t } = useTranslation();
  const environmentsQuery = useEnvironments();
  const reorderMutation = useReorderEnvironments();
  const createMutation = useCreateEnvironment();
  const updateMutation = useUpdateEnvironment();
  const deleteMutation = useDeleteEnvironment();

  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editEnv, setEditEnv] = useState<Environment | null>(null);
  const [deleteEnv, setDeleteEnv] = useState<Environment | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    if (!environmentsQuery.data) return;
    setOrderedIds(environmentsQuery.data.map((e) => e.id));
  }, [environmentsQuery.data]);

  const environmentsById = useMemo(() => {
    const map = new Map<string, Environment>();
    for (const env of environmentsQuery.data ?? []) map.set(env.id, env);
    return map;
  }, [environmentsQuery.data]);

  const orderedEnvironments = useMemo(() => {
    if (!orderedIds.length) return environmentsQuery.data ?? [];
    const resolved = orderedIds
      .map((id) => environmentsById.get(id))
      .filter((e): e is Environment => Boolean(e));
    const missing = (environmentsQuery.data ?? []).filter((e) => !orderedIds.includes(e.id));
    return [...resolved, ...missing];
  }, [environmentsById, environmentsQuery.data, orderedIds]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const currentIds = orderedEnvironments.map((e) => e.id);
    const oldIndex = currentIds.indexOf(String(active.id));
    const newIndex = currentIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(currentIds, oldIndex, newIndex);
    const prev = orderedIds.length ? orderedIds : currentIds;
    setOrderedIds(next);

    try {
      await reorderMutation.mutateAsync(next);
      toast.success(t('pages.environments.toast.reordered'));
    } catch (error) {
      setOrderedIds(prev);
      toast.error(t('pages.environments.toast.reorderFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleCreate = async (name: string, description: string) => {
    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: normalizeDescription(description) ?? undefined,
        position: getNextPosition(environmentsQuery.data)
      });
      toast.success(t('pages.environments.toast.created'));
      setCreateOpen(false);
    } catch (error) {
      toast.error(t('pages.environments.toast.createFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleUpdate = async (env: Environment, name: string, description: string) => {
    try {
      await updateMutation.mutateAsync({
        id: env.id,
        data: {
          name: name.trim(),
          description: normalizeDescription(description)
        }
      });
      toast.success(t('pages.environments.toast.updated'));
      setEditEnv(null);
    } catch (error) {
      toast.error(t('pages.environments.toast.updateFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleDelete = async (env: Environment) => {
    try {
      await deleteMutation.mutateAsync(env.id);
      toast.success(t('pages.environments.toast.deleted'));
      setDeleteEnv(null);
    } catch (error) {
      toast.error(t('pages.environments.toast.deleteFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          {environmentsQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">{t('pages.environments.table.loading')}</div>
          ) : environmentsQuery.isError ? (
            <div className="text-sm text-destructive">{t('pages.environments.table.loadFailed')}</div>
          ) : orderedEnvironments.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t('pages.environments.table.empty')}</div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedEnvironments.map((e) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10" />
                      <TableHead>{t('pages.environments.table.name')}</TableHead>
                      <TableHead>{t('pages.environments.table.description')}</TableHead>
                      <TableHead className="w-24">{t('pages.environments.table.position')}</TableHead>
                      <TableHead className="w-[120px] text-right">
                        {t('pages.environments.table.actions')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderedEnvironments.map((env) => (
                      <SortableEnvironmentRow
                        key={env.id}
                        environment={env}
                        onEdit={(e) => setEditEnv(e)}
                        onDelete={(e) => setDeleteEnv(e)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <UpsertEnvironmentDialog
        mode="create"
        open={createOpen}
        isPending={createMutation.isPending}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
      />

      <UpsertEnvironmentDialog
        mode="edit"
        open={!!editEnv}
        isPending={updateMutation.isPending}
        initial={editEnv ?? undefined}
        onOpenChange={(open) => !open && setEditEnv(null)}
        onSubmit={(name, description) => {
          if (!editEnv) return;
          return handleUpdate(editEnv, name, description);
        }}
      />

      <AlertDialog open={!!deleteEnv} onOpenChange={(open) => !open && setDeleteEnv(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pages.environments.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pages.environments.delete.description', {
                name: deleteEnv?.name ?? ''
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={!deleteEnv || deleteMutation.isPending}
              onClick={() => deleteEnv && handleDelete(deleteEnv)}
            >
              {deleteMutation.isPending
                ? t('pages.environments.delete.deleting')
                : t('pages.environments.delete.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function UpsertEnvironmentDialog({
                                   mode,
                                   open,
                                   onOpenChange,
                                   onSubmit,
                                   initial,
                                   isPending
                                 }: {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, description: string) => Promise<void> | void;
  initial?: Environment;
  isPending?: boolean;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initial) {
      setName(initial.name);
      setDescription(initial.description ?? '');
      return;
    }
    setName('');
    setDescription('');
  }, [initial, mode, open]);

  const canSubmit = name.trim().length > 0;

  const title =
    mode === 'create'
      ? t('pages.environments.create.title')
      : t('pages.environments.edit.title');

  const submitLabel =
    mode === 'create'
      ? t('pages.environments.create.confirm')
      : t('pages.environments.edit.confirm');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('pages.environments.form.name')}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('pages.environments.form.description')}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || !!isPending}
            onClick={() => onSubmit(name, description)}
          >
            {isPending ? t('common.saving') : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
