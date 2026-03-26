import { useTranslation } from '@/shared/lib/i18n';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { cn } from '@/shared/lib/utils';
import type { VariableResponse } from '@/entities/variable';
import { useDeleteVariable, useUpdateVariable } from '@/entities/variable';
import type { VariableSetResponse } from '@/entities/variable-set';
import {
  useCreateVariableSet,
  useDeleteVariableSet,
  useUpdateVariableSet,
  useVariableSet,
  useVariableSets,
  useAddVariableToSet,
  variableSetQueryKeys
} from '@/entities/variable-set';
import {
  DeleteVariableDialog,
  DeleteVariableSetDialog,
  UpsertVariableDialog,
  UpsertVariableSetDialog
} from '@/features/variable-set/management/ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { MoreVertical, Plus, Eye, EyeOff } from 'lucide-react';

export function EnvironmentsVariablesPage() {
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

  // Variable set dialogs state
  const [createSetOpen, setCreateSetOpen] = useState(false);
  const [editSet, setEditSet] = useState<VariableSetResponse | null>(null);
  const [deleteSet, setDeleteSet] = useState<VariableSetResponse | null>(null);

  // Variable dialogs state
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
        description: e instanceof Error ? e.message : undefined
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
      toast.error(t('pages.environmentsVariables.toast.setUpdateFailed'), {
        description: e instanceof Error ? e.message : undefined
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
      toast.error(t('pages.environmentsVariables.toast.setDeleteFailed'), {
        description: e instanceof Error ? e.message : undefined
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
        description: e instanceof Error ? e.message : undefined
      });
    }
  };

  const handleEditVar = async (variable: VariableResponse, data: { key: string; value: string }) => {
    if (!selectedId) return;
    try {
      await updateVarMutation.mutateAsync({
        id: variable.id,
        body: { key: data.key.trim(), value: data.value }
      });
      toast.success(t('pages.environmentsVariables.toast.variableUpdated'));
      setEditVar(null);
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.detail(selectedId) });
    } catch (e) {
      toast.error(t('pages.environmentsVariables.toast.variableUpdateFailed'), {
        description: e instanceof Error ? e.message : undefined
      });
    }
  };

  const handleDeleteVar = async (variable: VariableResponse) => {
    if (!selectedId) return;
    try {
      await deleteVarMutation.mutateAsync({ id: variable.id });
      toast.success(t('pages.environmentsVariables.toast.variableDeleted'));
      setDeleteVar(null);
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.detail(selectedId) });
    } catch (e) {
      toast.error(t('pages.environmentsVariables.toast.variableDeleteFailed'), {
        description: e instanceof Error ? e.message : undefined
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('pages.environmentsVariables.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('pages.environmentsVariables.subtitle')}</p>
        </div>
        <Button type="button" onClick={() => setCreateSetOpen(true)}>
          <Plus className="size-4" />
          {t('pages.environmentsVariables.sets.create.action')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">{t('pages.environmentsVariables.sets.list.title')}</div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('pages.environmentsVariables.sets.list.searchPlaceholder')}
            />
          </div>

          <div className="space-y-1">
            {variableSetsQuery.isLoading ? (
              <div className="text-sm text-muted-foreground">
                {t('pages.environmentsVariables.sets.list.loading')}
              </div>
            ) : filteredSets.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                {t('pages.environmentsVariables.sets.list.empty')}
              </div>
            ) : (
              filteredSets.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={cn(
                    'w-full text-left rounded-md border px-3 py-2 transition-colors',
                    selectedId === s.id
                      ? 'bg-muted border-input'
                      : 'border-transparent hover:bg-muted/50'
                  )}
                >
                  <div className="font-medium text-sm">{s.name}</div>
                  {s.description ? (
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {s.description}
                    </div>
                  ) : null}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-4 min-w-0">
          {!selectedId ? (
            <div className="text-sm text-muted-foreground">
              {t('pages.environmentsVariables.detail.emptyState')}
            </div>
          ) : selectedQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">
              {t('pages.environmentsVariables.detail.loading')}
            </div>
          ) : !selected ? (
            <div className="text-sm text-muted-foreground">
              {t('pages.environmentsVariables.detail.notFound')}
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold truncate">{selected.name}</div>
                  {selected.description ? (
                    <div className="text-sm text-muted-foreground mt-0.5">{selected.description}</div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button type="button" variant="outline" onClick={() => setCreateVarOpen(true)}>
                    <Plus className="size-4" />
                    {t('pages.environmentsVariables.variables.create.action')}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" size="icon">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditSet(selected)}>
                        {t('pages.environmentsVariables.sets.edit.action')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteSet(selected)}
                      >
                        {t('pages.environmentsVariables.sets.delete.action')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">
                  {t('pages.environmentsVariables.variables.table.title')}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('pages.environmentsVariables.variables.table.key')}</TableHead>
                      <TableHead>{t('pages.environmentsVariables.variables.table.value')}</TableHead>
                      <TableHead className="w-0" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.variables.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-muted-foreground">
                          {t('pages.environmentsVariables.variables.table.empty')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      selected.variables.map((v) => {
                        const isRevealed = revealed[v.id] === true;
                        const masked = '•'.repeat(Math.min(24, Math.max(8, v.value?.length ?? 8)));
                        return (
                          <TableRow key={v.id}>
                            <TableCell className="font-mono">{v.key}</TableCell>
                            <TableCell className="font-mono">
                              <div className="flex items-center gap-2">
                                <span className="truncate max-w-[520px]">
                                  {isRevealed ? v.value : masked}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setRevealed((prev) => ({ ...prev, [v.id]: !isRevealed }))
                                  }
                                >
                                  {isRevealed ? (
                                    <EyeOff className="size-4" />
                                  ) : (
                                    <Eye className="size-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button type="button" variant="ghost" size="icon">
                                    <MoreVertical className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setEditVar(v)}>
                                    {t('pages.environmentsVariables.variables.edit.action')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setDeleteVar(v)}
                                  >
                                    {t('pages.environmentsVariables.variables.delete.action')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>

      <UpsertVariableSetDialog
        mode="create"
        open={createSetOpen}
        onOpenChange={setCreateSetOpen}
        isPending={createSetMutation.isPending}
        onSubmit={handleCreateSet}
      />
      <UpsertVariableSetDialog
        mode="edit"
        open={editSet != null}
        onOpenChange={(o) => setEditSet(o ? editSet : null)}
        initial={editSet}
        isPending={updateSetMutation.isPending}
        onSubmit={(data) => (editSet ? handleEditSet(editSet, data) : undefined)}
      />
      <DeleteVariableSetDialog
        variableSet={deleteSet}
        open={deleteSet != null}
        onOpenChange={(o) => setDeleteSet(o ? deleteSet : null)}
        isPending={deleteSetMutation.isPending}
        onConfirm={() => (deleteSet ? handleDeleteSet(deleteSet) : undefined)}
      />

      <UpsertVariableDialog
        mode="create"
        open={createVarOpen}
        onOpenChange={setCreateVarOpen}
        isPending={addVarMutation.isPending}
        onSubmit={handleCreateVar}
      />
      <UpsertVariableDialog
        mode="edit"
        open={editVar != null}
        onOpenChange={(o) => setEditVar(o ? editVar : null)}
        initial={editVar}
        isPending={updateVarMutation.isPending}
        onSubmit={(data) => (editVar ? handleEditVar(editVar, data) : undefined)}
      />
      <DeleteVariableDialog
        variable={deleteVar}
        open={deleteVar != null}
        onOpenChange={(o) => setDeleteVar(o ? deleteVar : null)}
        isPending={deleteVarMutation.isPending}
        onConfirm={() => (deleteVar ? handleDeleteVar(deleteVar) : undefined)}
      />
    </div>
  );
}
