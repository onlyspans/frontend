import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/shared/lib/i18n';

import type { VariableResponse } from '@/entities/variable';
import {
  useCreateProjectVariable,
  useDeleteVariable,
  useProjectVariables,
  useUpdateVariable
} from '@/entities/variable';
import type { VariableSetResponse } from '@/entities/variable-set';
import { useVariableSets } from '@/entities/variable-set';
import {
  useLinkVariableSet,
  useProjectVariableSets,
  useUnlinkVariableSet
} from '@/entities/project-variable-sets';
import {
  getApiProblemDetail,
  getFirstValidationErrorMessage,
  handleApiError,
  isApiStatus
} from '@/shared/api';

export function useProjectVariablesManagement(projectId: string) {
  const { t } = useTranslation();

  const directVarsQuery = useProjectVariables(projectId);
  const createVarMutation = useCreateProjectVariable(projectId);
  const updateVarMutation = useUpdateVariable();
  const deleteVarMutation = useDeleteVariable();

  const linkedSetsQuery = useProjectVariableSets(projectId);
  const allSetsQuery = useVariableSets();
  const linkMutation = useLinkVariableSet(projectId);
  const unlinkMutation = useUnlinkVariableSet(projectId);

  const [createVarOpen, setCreateVarOpen] = useState(false);
  const [editVar, setEditVar] = useState<VariableResponse | null>(null);
  const [deleteVar, setDeleteVar] = useState<VariableResponse | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const [linkOpen, setLinkOpen] = useState(false);

  const availableToLink = useMemo(() => {
    const all = allSetsQuery.data ?? [];
    const linked = linkedSetsQuery.data ?? [];
    const linkedIds = new Set(linked.map((s) => s.id));
    return all.filter((s) => !linkedIds.has(s.id));
  }, [allSetsQuery.data, linkedSetsQuery.data]);

  const handleCreateVar = async (data: { key: string; value: string }) => {
    try {
      await createVarMutation.mutateAsync({ key: data.key.trim(), value: data.value.trim() });
      toast.success(t('pages.projectVariables.toast.variableCreated'));
      setCreateVarOpen(false);
    } catch (e) {
      toast.error(t('pages.projectVariables.toast.variableCreateFailed'), {
        description: getFirstValidationErrorMessage(e) ?? handleApiError(e)
      });
    }
  };

  const handleEditVar = async (variable: VariableResponse, data: { key: string; value: string }) => {
    try {
      await updateVarMutation.mutateAsync({
        id: variable.id,
        body: { key: data.key.trim(), value: data.value.trim() },
        projectId
      });
      toast.success(t('pages.projectVariables.toast.variableUpdated'));
      setEditVar(null);
    } catch (e) {
      const description = isApiStatus(e, 404)
        ? t('common.errors.entityNotFound')
        : getFirstValidationErrorMessage(e) ?? handleApiError(e);
      toast.error(t('pages.projectVariables.toast.variableUpdateFailed'), {
        description
      });
    }
  };

  const handleDeleteVar = async (variable: VariableResponse) => {
    try {
      await deleteVarMutation.mutateAsync({ id: variable.id, projectId });
      toast.success(t('pages.projectVariables.toast.variableDeleted'));
      setDeleteVar(null);
    } catch (e) {
      const description = isApiStatus(e, 404)
        ? t('common.errors.entityNotFound')
        : getApiProblemDetail(e) ?? handleApiError(e);
      toast.error(t('pages.projectVariables.toast.variableDeleteFailed'), {
        description
      });
    }
  };

  const handleLinkSet = async (setId: string) => {
    try {
      await linkMutation.mutateAsync({ setId });
      toast.success(t('pages.projectVariables.toast.setLinked'));
      setLinkOpen(false);
    } catch (e) {
      const description = isApiStatus(e, 404)
        ? t('common.errors.entityNotFound')
        : getApiProblemDetail(e) ?? handleApiError(e);
      toast.error(t('pages.projectVariables.toast.setLinkFailed'), {
        description
      });
    }
  };

  const handleUnlinkSet = async (set: VariableSetResponse) => {
    try {
      await unlinkMutation.mutateAsync({ setId: set.id });
      toast.success(t('pages.projectVariables.toast.setUnlinked'));
    } catch (e) {
      const description = isApiStatus(e, 404)
        ? t('common.errors.entityNotFound')
        : getApiProblemDetail(e) ?? handleApiError(e);
      toast.error(t('pages.projectVariables.toast.setUnlinkFailed'), {
        description
      });
    }
  };

  return {
    directVarsQuery,
    linkedSetsQuery,
    allSetsQuery,
    availableToLink,

    createVarOpen,
    setCreateVarOpen,
    editVar,
    setEditVar,
    deleteVar,
    setDeleteVar,
    revealed,
    setRevealed,

    linkOpen,
    setLinkOpen,

    createVarMutation,
    updateVarMutation,
    deleteVarMutation,
    linkMutation,
    unlinkMutation,

    handleCreateVar,
    handleEditVar,
    handleDeleteVar,
    handleLinkSet,
    handleUnlinkSet
  };
}
