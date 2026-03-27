import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from '@/shared/lib/i18n';
import type { VariableSetResponse } from '@/entities/variable-set';
import { Button } from '@/shared/ui/button';

export function VariableSetsList({
  items,
  isLoading,
  error,
  onRetry,
  query,
  onQueryChange,
  selectedId,
  onSelect
}: {
  items: VariableSetResponse[];
  isLoading: boolean;
  error?: unknown;
  onRetry?: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();
  const listId = 'variable-sets-list';

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="space-y-2">
        <div className="text-sm font-medium">{t('pages.environmentsVariables.sets.list.title')}</div>
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('pages.environmentsVariables.sets.list.searchPlaceholder')}
          aria-label={t('pages.environmentsVariables.sets.list.searchPlaceholder')}
          aria-controls={listId}
        />
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">{t('pages.environmentsVariables.sets.list.loading')}</div>
      ) : error ? (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">{t('pages.environmentsVariables.sets.list.error')}</div>
          {onRetry ? (
            <Button type="button" variant="outline" onClick={onRetry}>
              {t('pages.environmentsVariables.sets.list.retry')}
            </Button>
          ) : null}
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm text-muted-foreground">{t('pages.environmentsVariables.sets.list.empty')}</div>
      ) : (
        <div id={listId} className="space-y-1" aria-label={t('pages.environmentsVariables.sets.list.title')}>
          {items.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-selected={selectedId === s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                'w-full text-left rounded-md border px-3 py-2 transition-colors',
                selectedId === s.id ? 'bg-muted border-input' : 'border-transparent hover:bg-muted/50'
              )}
            >
              <div className="font-medium text-sm">{s.name}</div>
              {s.description ? (
                <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{s.description}</div>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
