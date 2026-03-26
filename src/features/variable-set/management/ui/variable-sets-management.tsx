import type { VariableResponse } from '@/entities/variable';
import type { VariableSetResponse } from '@/entities/variable-set';
import {
  DeleteVariableDialog,
  DeleteVariableSetDialog,
  UpsertVariableDialog,
  UpsertVariableSetDialog
} from './index';
import { VariableSetsList } from './variable-sets-list';
import { VariableSetDetail } from './variable-set-detail';
import { useVariableSetsManagement } from '../model/use-variable-sets-management';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

export function VariableSetsManagement() {
  const { t } = useTranslation();

  const vm = useVariableSetsManagement();
  const selected = vm.selected;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('pages.environmentsVariables.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('pages.environmentsVariables.subtitle')}</p>
        </div>
        <Button type="button" onClick={() => vm.setCreateSetOpen(true)}>
          <Plus className="size-4" />
          {t('pages.environmentsVariables.sets.create.action')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <VariableSetsList
          items={vm.filteredSets}
          isLoading={vm.variableSetsQuery.isLoading}
          query={vm.query}
          onQueryChange={vm.setQuery}
          selectedId={vm.selectedId}
          onSelect={vm.setSelectedId}
        />

        <VariableSetDetail
          selectedId={vm.selectedId}
          isLoading={vm.selectedQuery.isLoading}
          selected={selected}
          revealed={vm.revealed}
          onToggleReveal={(id) => vm.setRevealed((prev) => ({ ...prev, [id]: !(prev[id] === true) }))}
          onCreateVariable={() => vm.setCreateVarOpen(true)}
          onEditSet={(s: VariableSetResponse) => vm.setEditSet(s)}
          onDeleteSet={(s: VariableSetResponse) => vm.setDeleteSet(s)}
          onEditVariable={(v: VariableResponse) => vm.setEditVar(v)}
          onDeleteVariable={(v: VariableResponse) => vm.setDeleteVar(v)}
        />
      </div>

      <UpsertVariableSetDialog
        mode="create"
        open={vm.createSetOpen}
        onOpenChange={vm.setCreateSetOpen}
        isPending={vm.createSetMutation.isPending}
        onSubmit={vm.handleCreateSet}
      />
      <UpsertVariableSetDialog
        mode="edit"
        open={vm.editSet != null}
        onOpenChange={(o) => vm.setEditSet(o ? vm.editSet : null)}
        initial={vm.editSet}
        isPending={vm.updateSetMutation.isPending}
        onSubmit={(data) => (vm.editSet ? vm.handleEditSet(vm.editSet, data) : undefined)}
      />
      <DeleteVariableSetDialog
        variableSet={vm.deleteSet}
        open={vm.deleteSet != null}
        onOpenChange={(o) => vm.setDeleteSet(o ? vm.deleteSet : null)}
        isPending={vm.deleteSetMutation.isPending}
        onConfirm={() => (vm.deleteSet ? vm.handleDeleteSet(vm.deleteSet) : undefined)}
      />

      <UpsertVariableDialog
        mode="create"
        open={vm.createVarOpen}
        onOpenChange={vm.setCreateVarOpen}
        isPending={vm.addVarMutation.isPending}
        onSubmit={vm.handleCreateVar}
      />
      <UpsertVariableDialog
        mode="edit"
        open={vm.editVar != null}
        onOpenChange={(o) => vm.setEditVar(o ? vm.editVar : null)}
        initial={vm.editVar}
        isPending={vm.updateVarMutation.isPending}
        onSubmit={(data) => (vm.editVar ? vm.handleEditVar(vm.editVar, data) : undefined)}
      />
      <DeleteVariableDialog
        variable={vm.deleteVar}
        open={vm.deleteVar != null}
        onOpenChange={(o) => vm.setDeleteVar(o ? vm.deleteVar : null)}
        isPending={vm.deleteVarMutation.isPending}
        onConfirm={() => (vm.deleteVar ? vm.handleDeleteVar(vm.deleteVar) : undefined)}
      />
    </div>
  );
}
