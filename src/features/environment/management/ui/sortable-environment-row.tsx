import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';

import type { Environment } from '@/entities/environment';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { TableCell } from '@/shared/ui/table';
import { getContrastTextColor } from '@/shared/lib/color/get-contrast-text-color.ts';
import { Badge } from '@/shared/ui/badge.tsx';

export function SortableEnvironmentRow({
  environment,
  onEdit,
  onDelete
}: {
  environment: Environment;
  onEdit: (env: Environment) => void;
  onDelete: (env: Environment) => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: environment.id });

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        isDragging && 'bg-muted/60'
      )}
    >
      <TableCell className="w-10">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          ref={setActivatorNodeRef}
          className="cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </Button>
      </TableCell>
      <TableCell className="font-medium">
        <Badge
          key={environment.id}
          variant="secondary"
          className="text-xs"
          style={
            environment.color
              ? {
                backgroundColor: environment.color,
                color: getContrastTextColor(environment.color),
                borderColor: 'transparent'
              }
              : undefined
          }
        >
          {environment.name}
        </Badge>
      </TableCell>
      <TableCell className="min-w-[280px] whitespace-normal">
        {environment.description ?? <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell className="w-[120px]">
        <div className="flex items-center justify-end gap-1">
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onEdit(environment)}>
            <Pencil className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onDelete(environment)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </TableCell>
    </tr>
  );
}
