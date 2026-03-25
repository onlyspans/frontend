import { useEffect, useMemo, useState } from 'react';
import { PointerSensor, useSensor, useSensors, type SensorDescriptor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
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

function getNextPosition(environments: Environment[] | undefined): number {
  if (!environments?.length) return 0;
  return Math.max(...environments.map((e) => e.position)) + 1;
}

function normalizeDescription(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function useControlledBoolean({
  controlled,
  onChange,
  defaultValue = false
}: {
  controlled?: boolean;
  onChange?: (next: boolean) => void;
  defaultValue?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ?? uncontrolled;

  const setValue = (next: boolean) => {
    onChange?.(next);
    if (controlled === undefined) setUncontrolled(next);
  };

  return [value, setValue] as const;
}

export function useEnvironmentsManagement({
  createOpen: createOpenControlled,
  onCreateOpenChange
}: {
  createOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
} = {}) {
  const { t } = useTranslation();

  const environmentsQuery = useEnvironments();
  const reorderMutation = useReorderEnvironments();
  const createMutation = useCreateEnvironment();
  const updateMutation = useUpdateEnvironment();
  const deleteMutation = useDeleteEnvironment();

  const [createOpen, setCreateOpen] = useControlledBoolean({
    controlled: createOpenControlled,
    onChange: onCreateOpenChange
  });

  const [editEnv, setEditEnv] = useState<Environment | null>(null);
  const [deleteEnv, setDeleteEnv] = useState<Environment | null>(null);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  const dndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

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

  const handleReorder = async (activeId: string, overId: string) => {
    if (activeId === overId) return;

    const currentIds = orderedEnvironments.map((e) => e.id);
    const oldIndex = currentIds.indexOf(activeId);
    const newIndex = currentIds.indexOf(overId);
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

  const openCreate = () => setCreateOpen(true);
  const openEdit = (env: Environment) => setEditEnv(env);
  const openDelete = (env: Environment) => setDeleteEnv(env);

  return {
    environmentsQuery,
    orderedEnvironments,
    dndSensors: dndSensors as SensorDescriptor<Record<string, unknown>>[],

    createOpen,
    setCreateOpen,
    editEnv,
    setEditEnv,
    deleteEnv,
    setDeleteEnv,

    reorderMutation,
    createMutation,
    updateMutation,
    deleteMutation,

    openCreate,
    openEdit,
    openDelete,

    handleReorder,
    handleCreate,
    handleUpdate,
    handleDelete
  };
}

