import type { VariableResponse } from '@/entities/variable';
import type { VariableSetDetailResponse, VariableSetResponse } from '@/entities/variable-set';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Eye, EyeOff, MoreVertical, Plus } from 'lucide-react';

export function VariableSetDetail({
  selectedId,
  isLoading,
  selected,
  revealed,
  onToggleReveal,
  onCreateVariable,
  onEditSet,
  onDeleteSet,
  onEditVariable,
  onDeleteVariable
}: {
  selectedId: string | null;
  isLoading: boolean;
  selected: VariableSetDetailResponse | null;
  revealed: Record<string, boolean>;
  onToggleReveal: (variableId: string) => void;
  onCreateVariable: () => void;
  onEditSet: (set: VariableSetResponse) => void;
  onDeleteSet: (set: VariableSetResponse) => void;
  onEditVariable: (variable: VariableResponse) => void;
  onDeleteVariable: (variable: VariableResponse) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4 min-w-0">
      {!selectedId ? (
        <div className="text-sm text-muted-foreground">
          {t('pages.environmentsVariables.detail.emptyState')}
        </div>
      ) : isLoading ? (
        <div className="text-sm text-muted-foreground">{t('pages.environmentsVariables.detail.loading')}</div>
      ) : !selected ? (
        <div className="text-sm text-muted-foreground">{t('pages.environmentsVariables.detail.notFound')}</div>
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
              <Button type="button" variant="outline" onClick={onCreateVariable}>
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
                  <DropdownMenuItem onClick={() => onEditSet(selected)}>
                    {t('pages.environmentsVariables.sets.edit.action')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDeleteSet(selected)}
                  >
                    {t('pages.environmentsVariables.sets.delete.action')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">{t('pages.environmentsVariables.variables.table.title')}</div>
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
                            <span className="truncate max-w-[520px]">{isRevealed ? v.value : masked}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onToggleReveal(v.id)}
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
                              <DropdownMenuItem onClick={() => onEditVariable(v)}>
                                {t('pages.environmentsVariables.variables.edit.action')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDeleteVariable(v)}
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
  );
}
