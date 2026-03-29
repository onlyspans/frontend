import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

type DashboardComingSoonTileProps = {
  title: string;
  description: string;
  className?: string;
};

export function DashboardComingSoonTile({ title, description, className }: DashboardComingSoonTileProps) {
  return (
    <Card className={cn('gap-3 py-4', className)}>
      <CardHeader className="px-6 pb-1">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
