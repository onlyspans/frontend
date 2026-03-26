import type { Project } from '@/entities/project';
import { useProjectVariablesManagement } from '../model/use-project-variables-management';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import { Plus, Eye, EyeOff, Link2, Unlink2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { UpsertProjectVariableDialog } from './upsert-project-variable-dialog';
import { DeleteProjectVariableDialog } from './delete-project-variable-dialog';
import { LinkVariableSetDialog } from './link-variable-set-dialog';

export function ProjectVariablesTabContent({ project }: { project: Project }) {
  const { t } = useTranslation();
  const vm = useProjectVariablesManagement(project.id);

  const directVars = vm.directVarsQuery.data ?? [];
  const linkedSets = vm.linkedSetsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('pages.projectVariables.title')}</h2>
        <p className="text-muted-foreground">
          {t('pages.projectVariables.subtitle', { projectName: project.name })}
        </p>
      </div>

      <section className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-medium">{t('pages.projectVariables.direct.title')}</div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {t('pages.projectVariables.direct.hint')}
            </div>
          </div>
          <Button type="button" onClick={() => vm.setCreateVarOpen(true)}>
            <Plus className="size-4" />
            {t('pages.projectVariables.direct.create.action')}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('pages.projectVariables.direct.table.key')}</TableHead>
              <TableHead>{t('pages.projectVariables.direct.table.value')}</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {vm.directVarsQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">
                  {t('pages.projectVariables.direct.table.loading')}
                </TableCell>
              </TableRow>
            ) : directVars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">
                  {t('pages.projectVariables.direct.table.empty')}
                </TableCell>
              </TableRow>
            ) : (
              directVars.map((v) => {
                const isRevealed = vm.revealed[v.id] === true;
                const masked = '•'.repeat(Math.min(24, Math.max(8, v.value?.length ?? 8)));
                return (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono">{v.key}</TableCell>
                    <TableCell className="font-mono">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[520px]">{isRevealed ? v.value : masked}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            vm.setRevealed((prev) => ({ ...prev, [v.id]: !(prev[v.id] === true) }))
                          }
                        >
                          {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                          <DropdownMenuItem onClick={() => vm.setEditVar(v)}>
                            {t('pages.projectVariables.direct.edit.action')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => vm.setDeleteVar(v)}
                          >
                            {t('pages.projectVariables.direct.delete.action')}
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
      </section>

      <section className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-medium">{t('pages.projectVariables.linked.title')}</div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {t('pages.projectVariables.linked.hint')}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => vm.setLinkOpen(true)}
            disabled={vm.availableToLink.length === 0}
          >
            <Link2 className="size-4" />
            {t('pages.projectVariables.linked.link.action')}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('pages.projectVariables.linked.table.name')}</TableHead>
              <TableHead>{t('pages.projectVariables.linked.table.description')}</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {vm.linkedSetsQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">
                  {t('pages.projectVariables.linked.table.loading')}
                </TableCell>
              </TableRow>
            ) : linkedSets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">
                  {t('pages.projectVariables.linked.table.empty')}
                </TableCell>
              </TableRow>
            ) : (
              linkedSets.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.description ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => vm.handleUnlinkSet(s)}
                      disabled={vm.unlinkMutation.isPending}
                    >
                      <Unlink2 className="size-4" />
                      {t('pages.projectVariables.linked.unlink.action')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      <UpsertProjectVariableDialog
        mode="create"
        open={vm.createVarOpen}
        onOpenChange={vm.setCreateVarOpen}
        isPending={vm.createVarMutation.isPending}
        onSubmit={vm.handleCreateVar}
      />
      <UpsertProjectVariableDialog
        mode="edit"
        open={vm.editVar != null}
        onOpenChange={(o) => vm.setEditVar(o ? vm.editVar : null)}
        initial={vm.editVar}
        isPending={vm.updateVarMutation.isPending}
        onSubmit={(data) => (vm.editVar ? vm.handleEditVar(vm.editVar, data) : undefined)}
      />
      <DeleteProjectVariableDialog
        variable={vm.deleteVar}
        open={vm.deleteVar != null}
        onOpenChange={(o) => vm.setDeleteVar(o ? vm.deleteVar : null)}
        isPending={vm.deleteVarMutation.isPending}
        onConfirm={() => (vm.deleteVar ? vm.handleDeleteVar(vm.deleteVar) : undefined)}
      />

      <LinkVariableSetDialog
        open={vm.linkOpen}
        onOpenChange={vm.setLinkOpen}
        availableSets={vm.availableToLink}
        isPending={vm.linkMutation.isPending}
        onSubmit={vm.handleLinkSet}
      />
    </div>
  );
}
