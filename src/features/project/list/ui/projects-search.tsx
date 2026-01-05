import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';

interface ProjectsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProjectsSearch({ value, onChange }: ProjectsSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search projects by name, description, or lifecycle..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
