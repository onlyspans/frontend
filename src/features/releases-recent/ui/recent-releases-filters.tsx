import { Search, TagIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import { useTags } from '@/entities/tag';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from '@/shared/lib/i18n';

export interface RecentReleasesFiltersProps {
  className?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  tagIdsFilter: string[];
  onTagIdsChange: (ids: string[]) => void;
}

export function RecentReleasesFilters({
  className,
  searchValue,
  onSearchChange,
  tagIdsFilter,
  onTagIdsChange
}: RecentReleasesFiltersProps) {
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
    <div className={cn('flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4', className)}>
      <div className="relative w-full sm:w-1/3 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('pages.releases.searchPlaceholder')}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <TagIcon className="size-4 mr-1" />
            {t('project.tags')}
            {tagIdsFilter.length > 0 && (
              <span className="ml-1 rounded bg-primary/20 px-1.5 text-xs">{tagIdsFilter.length}</span>
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
