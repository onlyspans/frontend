import { useEffect, useMemo, useRef, useState } from 'react';
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

function areArraysEqual(a: string[], b: string[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
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

  const [reorderMode, setReorderMode] = useState(false);

  const [editEnv, setEditEnv] = useState<Environment | null>(null);
  const [deleteEnv, setDeleteEnv] = useState<Environment | null>(null);
  const [draftOrderedIds, setDraftOrderedIds] = useState<string[]>([]);
  const [baselineOrderedIds, setBaselineOrderedIds] = useState<string[]>([]);
  const wasReorderMode = useRef<boolean>(reorderMode);

  const dndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    if (!environmentsQuery.data) return;
    const serverIds = environmentsQuery.data.map((e) => e.id);
    if (!reorderMode) {
      setDraftOrderedIds(serverIds);
    }
  }, [environmentsQuery.data, reorderMode]);

  useEffect(() => {
    const prev = wasReorderMode.current;
    if (prev === reorderMode) return;
    wasReorderMode.current = reorderMode;

    if (!reorderMode) return;
    const snapshot = (environmentsQuery.data ?? []).map((e) => e.id);
    setBaselineOrderedIds(snapshot);
    setDraftOrderedIds(snapshot);
  }, [environmentsQuery.data, reorderMode]);

  const environmentsById = useMemo(() => {
    const map = new Map<string, Environment>();
    for (const env of environmentsQuery.data ?? []) map.set(env.id, env);
    return map;
  }, [environmentsQuery.data]);

  const orderedEnvironments = useMemo(() => {
    if (!draftOrderedIds.length) return environmentsQuery.data ?? [];
    const resolved = draftOrderedIds
      .map((id) => environmentsById.get(id))
      .filter((e): e is Environment => Boolean(e));
    const missing = (environmentsQuery.data ?? []).filter((e) => !draftOrderedIds.includes(e.id));
    return [...resolved, ...missing];
  }, [draftOrderedIds, environmentsById, environmentsQuery.data]);

  const handleDraftReorder = (activeId: string, overId: string) => {
    if (!reorderMode) return;
    if (activeId === overId) return;

    const currentIds = orderedEnvironments.map((e) => e.id);
    const oldIndex = currentIds.indexOf(activeId);
    const newIndex = currentIds.indexOf(overId);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(currentIds, oldIndex, newIndex);
    setDraftOrderedIds(next);
  };

  const enterReorderMode = () => setReorderMode(true);

  const hasDraftReorderChanges = useMemo(() => {
    if (!reorderMode) return false;
    return !areArraysEqual(draftOrderedIds, baselineOrderedIds);
  }, [baselineOrderedIds, draftOrderedIds, reorderMode]);

  const cancelReorderMode = () => {
    setDraftOrderedIds(baselineOrderedIds);
    setReorderMode(false);
  };

  const saveReorderMode = async () => {
    if (!reorderMode) return;
    if (!hasDraftReorderChanges) {
      setReorderMode(false);
      return;
    }

    try {
      await reorderMutation.mutateAsync(draftOrderedIds);
      toast.success(t('pages.environments.toast.reordered'));
      setReorderMode(false);
    } catch (error) {
      toast.error(t('pages.environments.toast.reorderFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleCreate = async (
    name: string,
    description: string,
    color:
      | { mode: 'unset' }
      | { mode: 'value'; value: string }
  ) => {
    try {
      const colorPayload =
        color.mode === 'value' ? { color: color.value.trim() } : {};
      await createMutation.mutateAsync({
        name: name.trim(),
        description: normalizeDescription(description) ?? undefined,
        position: getNextPosition(environmentsQuery.data),
        ...colorPayload
      });
      toast.success(t('pages.environments.toast.created'));
      setCreateOpen(false);
    } catch (error) {
      toast.error(t('pages.environments.toast.createFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleUpdate = async (
    env: Environment,
    name: string,
    description: string,
    color:
      | { mode: 'nochange' }
      | { mode: 'reset' }
      | { mode: 'value'; value: string }
  ) => {
    try {
      const colorPayload =
        color.mode === 'nochange'
          ? {}
          : color.mode === 'reset'
            ? { color: null as null }
            : { color: color.value.trim() };
      await updateMutation.mutateAsync({
        id: env.id,
        data: {
          name: name.trim(),
          description: normalizeDescription(description),
          ...colorPayload
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
    reorderMode,
    setReorderMode,
    editEnv,
    setEditEnv,
    deleteEnv,
    setDeleteEnv,
    hasDraftReorderChanges,

    reorderMutation,
    createMutation,
    updateMutation,
    deleteMutation,

    openCreate,
    openEdit,
    openDelete,

    enterReorderMode,
    handleDraftReorder,
    saveReorderMode,
    cancelReorderMode,
    handleCreate,
    handleUpdate,
    handleDelete
  };
}

