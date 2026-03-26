import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { VariableResponse } from '@/entities/variable';
import { useDeleteVariable, useUpdateVariable } from '@/entities/variable';
import type { VariableSetResponse } from '@/entities/variable-set';
import {
  useAddVariableToSet,
  useCreateVariableSet,
  useDeleteVariableSet,
  useUpdateVariableSet,
  useVariableSet,
  useVariableSets,
  variableSetQueryKeys
} from '@/entities/variable-set';
import { useTranslation } from '@/shared/lib/i18n';
import {
  getApiProblemDetail,
  getFirstValidationErrorMessage,
  handleApiError,
  isApiStatus
} from '@/shared/api';

export function useVariableSetsManagement() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const variableSetsQuery = useVariableSets();

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedQuery = useVariableSet(selectedId ?? '');
  const selected = selectedQuery.data ?? null;

  useEffect(() => {
    if (selectedId) return;
    const first = variableSetsQuery.data?.[0];
    if (first) setSelectedId(first.id);
  }, [selectedId, variableSetsQuery.data]);

  const filteredSets = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = variableSetsQuery.data ?? [];
    if (!q) return items;
    return items.filter((s) => {
      const name = s.name?.toLowerCase() ?? '';
      const desc = s.description?.toLowerCase() ?? '';
      return name.includes(q) || desc.includes(q);
    });
  }, [query, variableSetsQuery.data]);

  // dialogs state
  const [createSetOpen, setCreateSetOpen] = useState(false);
  const [editSet, setEditSet] = useState<VariableSetResponse | null>(null);
  const [deleteSet, setDeleteSet] = useState<VariableSetResponse | null>(null);

  const [createVarOpen, setCreateVarOpen] = useState(false);
  const [editVar, setEditVar] = useState<VariableResponse | null>(null);
  const [deleteVar, setDeleteVar] = useState<VariableResponse | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const createSetMutation = useCreateVariableSet();
  const updateSetMutation = useUpdateVariableSet();
  const deleteSetMutation = useDeleteVariableSet();

  const addVarMutation = useAddVariableToSet(selectedId ?? '');
  const updateVarMutation = useUpdateVariable();
  const deleteVarMutation = useDeleteVariable();

  const handleCreateSet = async (data: { name: string; description: string }) => {
    try {
      const created = await createSetMutation.mutateAsync({
        name: data.name.trim(),
        description: data.description.trim() ? data.description.trim() : undefined
      });
      toast.success(t('pages.environmentsVariables.toast.setCreated'));
      setCreateSetOpen(false);
      setSelectedId(created.id);
    } catch (e) {
      toast.error(t('pages.environmentsVariables.toast.setCreateFailed'), {
        description: getFirstValidationErrorMessage(e) ?? handleApiError(e)
      });
    }
  };

  const handleEditSet = async (set: VariableSetResponse, data: { name: string; description: string }) => {
    try {
      await updateSetMutation.mutateAsync({
        id: set.id,
        body: {
          name: data.name.trim(),
          description: data.description.trim() ? data.description.trim() : null
        }
      });
      toast.success(t('pages.environmentsVariables.toast.setUpdated'));
      setEditSet(null);
    } catch (e) {
      const description = isApiStatus(e, 404)
        ? t('pages.environmentsVariables.errors.notFound')
        : getFirstValidationErrorMessage(e) ?? handleApiError(e);
      toast.error(t('pages.environmentsVariables.toast.setUpdateFailed'), {
        description
      });
    }
  };

  const handleDeleteSet = async (set: VariableSetResponse) => {
    try {
      await deleteSetMutation.mutateAsync({ id: set.id });
      toast.success(t('pages.environmentsVariables.toast.setDeleted'));
      setDeleteSet(null);
      if (selectedId === set.id) {
        const next = (variableSetsQuery.data ?? []).find((s) => s.id !== set.id) ?? null;
        setSelectedId(next?.id ?? null);
      }
    } catch (e) {
      const description = isApiStatus(e, 404)
        ? t('pages.environmentsVariables.errors.notFound')
        : getApiProblemDetail(e) ?? handleApiError(e);
      toast.error(t('pages.environmentsVariables.toast.setDeleteFailed'), {
        description
      });
    }
  };

  const handleCreateVar = async (data: { key: string; value: string }) => {
    if (!selectedId) return;
    try {
      await addVarMutation.mutateAsync({ key: data.key.trim(), value: data.value });
      toast.success(t('pages.environmentsVariables.toast.variableCreated'));
      setCreateVarOpen(false);
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.detail(selectedId) });
    } catch (e) {
      toast.error(t('pages.environmentsVariables.toast.variableCreateFailed'), {
        description: getFirstValidationErrorMessage(e) ?? handleApiError(e)
      });
    }
  };

  const handleEditVar = async (variable: VariableResponse, data: { key: string; value: string }) => {
    if (!selectedId) return;
    try {
      await updateVarMutation.mutateAsync({
        id: variable.id,
        body: { key: data.key.trim(), value: data.value },
        setId: selectedId
      });
      toast.success(t('pages.environmentsVariables.toast.variableUpdated'));
      setEditVar(null);
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.detail(selectedId) });
    } catch (e) {
      const description = isApiStatus(e, 404)
        ? t('pages.environmentsVariables.errors.notFound')
        : getFirstValidationErrorMessage(e) ?? handleApiError(e);
      toast.error(t('pages.environmentsVariables.toast.variableUpdateFailed'), {
        description
      });
    }
  };

  const handleDeleteVar = async (variable: VariableResponse) => {
    if (!selectedId) return;
    try {
      await deleteVarMutation.mutateAsync({ id: variable.id, setId: selectedId });
      toast.success(t('pages.environmentsVariables.toast.variableDeleted'));
      setDeleteVar(null);
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.detail(selectedId) });
    } catch (e) {
      const description = isApiStatus(e, 404)
        ? t('pages.environmentsVariables.errors.notFound')
        : getApiProblemDetail(e) ?? handleApiError(e);
      toast.error(t('pages.environmentsVariables.toast.variableDeleteFailed'), {
        description
      });
    }
  };

  return {
    variableSetsQuery,
    filteredSets,
    query,
    setQuery,

    selectedId,
    setSelectedId,
    selectedQuery,
    selected,

    createSetOpen,
    setCreateSetOpen,
    editSet,
    setEditSet,
    deleteSet,
    setDeleteSet,

    createVarOpen,
    setCreateVarOpen,
    editVar,
    setEditVar,
    deleteVar,
    setDeleteVar,

    revealed,
    setRevealed,

    createSetMutation,
    updateSetMutation,
    deleteSetMutation,
    addVarMutation,
    updateVarMutation,
    deleteVarMutation,

    handleCreateSet,
    handleEditSet,
    handleDeleteSet,
    handleCreateVar,
    handleEditVar,
    handleDeleteVar
  };
}
