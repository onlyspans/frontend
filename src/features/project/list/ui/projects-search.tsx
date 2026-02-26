import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib';

interface ProjectsSearchProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

export function ProjectsSearch({ className, value, onChange }: ProjectsSearchProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search projects by name or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
