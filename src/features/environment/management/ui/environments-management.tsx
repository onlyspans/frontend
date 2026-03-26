import { useEnvironmentsManagement } from '../model';
import { EnvironmentsTable } from './environments-table';
import { DeleteEnvironmentDialog } from './delete-environment-dialog';
import { UpsertEnvironmentDialog } from './upsert-environment-dialog';

export function EnvironmentsManagement({
  createOpen,
  onCreateOpenChange
}: {
  createOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
}) {
  const vm = useEnvironmentsManagement({
    createOpen,
    onCreateOpenChange
  });

  return (
    <>
      <EnvironmentsTable
        environmentsQuery={vm.environmentsQuery}
        orderedEnvironments={vm.orderedEnvironments}
        dndSensors={vm.dndSensors}
        reorderMode={vm.reorderMode}
        hasDraftReorderChanges={vm.hasDraftReorderChanges}
        onEnterReorderMode={vm.enterReorderMode}
        onDraftReorder={vm.handleDraftReorder}
        onSaveReorder={vm.saveReorderMode}
        onCancelReorder={vm.cancelReorderMode}
        onEdit={vm.openEdit}
        onDelete={vm.openDelete}
      />

      <UpsertEnvironmentDialog
        mode="create"
        open={vm.createOpen}
        isPending={vm.createMutation.isPending}
        onOpenChange={vm.setCreateOpen}
        onSubmit={(name, description, color) => {
          if (color.mode === 'value') {
            return vm.handleCreate(name, description, color);
          }
          return vm.handleCreate(name, description, { mode: 'unset' });
        }}
      />

      <UpsertEnvironmentDialog
        mode="edit"
        open={!!vm.editEnv}
        isPending={vm.updateMutation.isPending}
        initial={vm.editEnv ?? undefined}
        onOpenChange={(open) => !open && vm.setEditEnv(null)}
        onSubmit={(name, description, color) => {
          if (!vm.editEnv) return;
          if (color.mode === 'value') {
            return vm.handleUpdate(vm.editEnv, name, description, color);
          }
          if (color.mode === 'reset') {
            return vm.handleUpdate(vm.editEnv, name, description, color);
          }
          return vm.handleUpdate(vm.editEnv, name, description, { mode: 'nochange' });
        }}
      />

      <DeleteEnvironmentDialog
        environment={vm.deleteEnv}
        open={!!vm.deleteEnv}
        isPending={vm.deleteMutation.isPending}
        onOpenChange={(open) => !open && vm.setDeleteEnv(null)}
        onConfirm={() => vm.deleteEnv && vm.handleDelete(vm.deleteEnv)}
      />
    </>
  );
}
