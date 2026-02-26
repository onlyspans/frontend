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
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { Checkbox } from '@/shared/ui/checkbox';
import { useTags } from '@/entities/tag';
import type { ProjectStatus } from '@/entities/project';
import { FilterIcon, TagIcon } from 'lucide-react';

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
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <FilterIcon className="size-4 text-muted-foreground" />
        <Select
          value={statusFilter || 'all'}
          onValueChange={(v) =>
            onStatusChange((v === 'all' ? '' : v) as ProjectStatus | '')
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TagIcon className="size-4 mr-1" />
            Tags
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
              No tags yet
            </div>
          ) : (
            tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm"
              >
                <Checkbox
                  checked={tagIdsFilter.includes(tag.id)}
                  onCheckedChange={() => toggleTag(tag.id)}
                />
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: tag.color ?? 'var(--muted)'
                  }}
                />
                <span className="text-sm truncate">{tag.name}</span>
              </label>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
