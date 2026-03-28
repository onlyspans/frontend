import { Fragment, useMemo, useState } from 'react';
import type { Event } from '@/entities/event';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { cn } from '@/shared/lib';
import { Copy } from 'lucide-react';
import type { EventsSortField, SortOrder } from '../hooks/use-events-log';
import { useTranslation } from '@/shared/lib/i18n';
import { toast } from 'sonner';

function formatDateTime(iso: string, invalidLabel: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return invalidLabel;
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  } catch {
    return invalidLabel;
  }
}

async function copyToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.focus();
  el.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(el);
  if (!ok) {
    throw new Error('execCommand("copy") returned false');
  }
}

function SortHead({
  label,
  field,
  currentSortBy,
  sortOrder,
  onSort
}: {
  label: string;
  field: EventsSortField;
  currentSortBy: EventsSortField;
  sortOrder: SortOrder;
  onSort: (field: EventsSortField) => void;
}) {
  const { t } = useTranslation();
  const isActive = currentSortBy === field;
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:underline font-medium"
        title={t('pages.events.table.sortHint')}
      >
        {label}
        {isActive && (
          <span
            className="text-muted-foreground text-xs"
            aria-label={sortOrder === 'asc' ? t('pages.events.table.sortAsc') : t('pages.events.table.sortDesc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </button>
    </TableHead>
  );
}

interface EventsTableProps {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  sortBy: EventsSortField;
  sortOrder: SortOrder;
  onSort: (field: EventsSortField) => void;
}

export function EventsTable({
  events,
  isLoading,
  isError,
  sortBy,
  sortOrder,
  onSort
}: EventsTableProps) {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const columns = useMemo(
    () => [
      { key: 'timestamp', label: t('pages.events.table.timestamp'), sortable: true },
      { key: 'entity_id', label: t('pages.events.table.entityId'), sortable: true },
      { key: 'entity_name', label: t('pages.events.table.entityName'), sortable: true },
      { key: 'action', label: t('pages.events.table.action'), sortable: true },
      { key: 'user_id', label: t('pages.events.table.userId'), sortable: true },
      { key: 'tenant', label: t('pages.events.table.tenant'), sortable: true },
      { key: 'changes', label: t('pages.events.table.changes'), sortable: false }
    ] as const,
    [t]
  );

  if (isLoading) {
    return (
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow className="hover:bg-secondary">
              <TableHead className="w-[40px]" />
              {columns.map((c) => (
                <TableHead key={c.key}>{c.label}</TableHead>
              ))}
              <TableHead className="w-[44px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="text-center py-8 text-muted-foreground">
                {t('pages.events.table.loading')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          'rounded-md border bg-card overflow-hidden',
          'p-6 text-sm text-destructive'
        )}
      >
        {t('pages.events.table.loadFailed')}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow className="hover:bg-secondary">
              <TableHead className="w-[40px]" />
              {columns.map((c) => (
                <TableHead key={c.key}>{c.label}</TableHead>
              ))}
              <TableHead className="w-[44px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="text-center py-8 text-muted-foreground">
                {t('pages.events.table.empty')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow className="hover:bg-secondary">
            <TableHead className="w-[40px]" />
            <SortHead
              label={t('pages.events.table.timestamp')}
              field="timestamp"
              currentSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortHead
              label={t('pages.events.table.entityId')}
              field="entity_id"
              currentSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortHead
              label={t('pages.events.table.entityName')}
              field="entity_name"
              currentSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortHead
              label={t('pages.events.table.action')}
              field="action"
              currentSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortHead
              label={t('pages.events.table.userId')}
              field="user_id"
              currentSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortHead
              label={t('pages.events.table.tenant')}
              field="tenant"
              currentSortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <TableHead>{t('pages.events.table.changes')}</TableHead>
            <TableHead className="w-[44px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((e) => {
            const expanded = Boolean(expandedIds[e.id]);
            const changes = e.changes ?? [];
            return (
              <Fragment key={e.id}>
                <TableRow
                  className={cn(changes.length > 0 ? 'cursor-pointer' : undefined)}
                  onClick={() => changes.length > 0 && toggleExpanded(e.id)}
                >
                  <TableCell className="text-muted-foreground w-[40px]">
                    {changes.length > 0 ? (expanded ? '▾' : '▸') : ''}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDateTime(e.timestamp, t('pages.events.table.invalidTimestamp'))}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{e.entityId}</TableCell>
                  <TableCell className="text-muted-foreground">{e.entityName ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {e.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{e.userId ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{e.tenant ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {changes.length ? t('pages.events.table.changesCount', { value: changes.length }) : '—'}
                  </TableCell>
                  <TableCell onClick={(evt) => evt.stopPropagation()}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={t('pages.events.table.copyId')}
                          onClick={async () => {
                            try {
                              await copyToClipboard(e.id);
                            } catch (err) {
                              console.error('Failed to copy event id', err);
                              toast.error(t('pages.events.table.copyFailed'));
                            }
                          }}
                        >
                          <Copy className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>{t('pages.events.table.copyId')}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                {expanded && changes.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="bg-muted/30">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm py-2">
                        {changes.map((c, idx) => (
                          <div key={idx} className="rounded-md border bg-card p-3">
                            <div className="text-xs text-muted-foreground">
                              {t('pages.events.table.changeField')}: {c.field ?? '—'}
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-xs text-muted-foreground">{t('pages.events.table.oldValue')}</div>
                                <div className="font-mono text-xs break-all">{c.oldValue ?? '—'}</div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">{t('pages.events.table.newValue')}</div>
                                <div className="font-mono text-xs break-all">{c.newValue ?? '—'}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
