import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/shared/ui/dropdown-menu';
import { useTags } from '@/entities/tag';
import type { ProjectStatus } from '@/entities/project';
import { FilterIcon, TagIcon } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

interface ProjectsFiltersProps {
  statusFilter: ProjectStatus | '';
  onStatusChange: (value: ProjectStatus | '') => void;
  tagIdsFilter: string[];
  onTagIdsChange: (ids: string[]) => void;
}

export function ProjectsFilters({
  statusFilter,
  onStatusChange,
  tagIdsFilter,
  onTagIdsChange
}: ProjectsFiltersProps) {
  const { t } = useTranslation();
  const { data: tagsData } = useTags({ pageSize: 100 });
  const tags = tagsData?.items ?? [];

  const toggleTag = (tagId: string) => {
    if (tagIdsFilter.includes(tagId)) {
      onTagIdsChange(tagIdsFilter.filter((id) => id !== tagId));
    } else {
      onTagIdsChange([...tagIdsFilter, tagId]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-3">
        <FilterIcon className="size-4 text-muted-foreground" />
        <Select
          value={statusFilter || 'all'}
          onValueChange={(v) =>
            onStatusChange((v === 'all' ? '' : v) as ProjectStatus | '')
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('project.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('project.allStatuses')}</SelectItem>
            <SelectItem value="active">{t('project.active')}</SelectItem>
            <SelectItem value="archived">{t('project.archived')}</SelectItem>
            <SelectItem value="suspended">{t('project.suspended')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <TagIcon className="size-4 mr-1" />
            {t('project.tags')}
            {tagIdsFilter.length > 0 && (
              <span className="ml-1 rounded bg-primary/20 px-1.5 text-xs">
                {tagIdsFilter.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto w-56">
          {tags.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              {t('project.filters.noTagsYet')}
            </div>
          ) : (
            tags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag.id}
                checked={tagIdsFilter.includes(tag.id)}
                onCheckedChange={() => toggleTag(tag.id)}
                className="flex items-center gap-2"
              >
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: tag.color ?? 'var(--muted)'
                  }}
                />
                <span className="text-sm truncate">{tag.name}</span>
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
