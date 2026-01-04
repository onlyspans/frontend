'use client';

import { Clock, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/shared/ui/sidebar';
import { Badge } from '@/shared/ui/badge';
import { useSpaceUrl } from '@/shared/hooks/use-space-url.ts';

export function NavActivity(
  { activities }: {
    activities: {
      title: string
      url: string
      icon?: LucideIcon
      time: string
      type?: 'deployment' | 'build' | 'update' | 'other'
    }[]
  }
) {
  const { getSpaceUrl } = useSpaceUrl()

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'deployment':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'build':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'update':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Activity</SidebarGroupLabel>
      <SidebarMenu>
        {activities.map((activity, index) => (
          <SidebarMenuItem key={`${activity.title}-${index}`}>
            <SidebarMenuButton asChild>
              <Link to={getSpaceUrl(activity.url)} className="group/activity h-14">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {activity.icon && (
                    <activity.icon className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm">{activity.title}</span>
                      {activity.type && (
                        <Badge
                          variant="outline"
                          className={`text-xs shrink-0 ${getTypeColor(activity.type)}`}
                        >
                          {activity.type}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
