import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from '@/shared/lib/i18n';
import type { VariableSetResponse } from '@/entities/variable-set';

export function VariableSetsList({
  items,
  isLoading,
  query,
  onQueryChange,
  selectedId,
  onSelect
}: {
  items: VariableSetResponse[];
  isLoading: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();
  const listboxId = 'variable-sets-listbox';
  const selectedOptionId = selectedId ? `variable-set-option-${selectedId}` : undefined;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="space-y-2">
        <div className="text-sm font-medium">{t('pages.environmentsVariables.sets.list.title')}</div>
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('pages.environmentsVariables.sets.list.searchPlaceholder')}
          aria-label={t('pages.environmentsVariables.sets.list.searchPlaceholder')}
          aria-controls={listboxId}
        />
      </div>

      <div
        id={listboxId}
        role="listbox"
        aria-activedescendant={selectedOptionId}
        className="space-y-1"
      >
        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            {t('pages.environmentsVariables.sets.list.loading')}
          </div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            {t('pages.environmentsVariables.sets.list.empty')}
          </div>
        ) : (
          items.map((s) => (
            <button
              key={s.id}
              id={`variable-set-option-${s.id}`}
              type="button"
              role="option"
              aria-selected={selectedId === s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                'w-full text-left rounded-md border px-3 py-2 transition-colors',
                selectedId === s.id ? 'bg-muted border-input' : 'border-transparent hover:bg-muted/50'
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
  );
}
