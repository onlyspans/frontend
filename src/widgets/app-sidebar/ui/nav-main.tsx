"use client"

import { ChevronRight } from "lucide-react"
import { Link } from 'react-router-dom';
import { useTranslation } from '@/shared/lib/i18n';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/shared/ui/sidebar"
import type { SidebarNavItem } from '../config/sidebar-config';

export function NavMain({ items }: { items: SidebarNavItem[] }) {
  const { t } = useTranslation();
  const { state, isMobile } = useSidebar();
  const collapsedDesktop = state === "collapsed" && !isMobile;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('sidebar.platform')}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.items && item.items.length > 0) {
            if (collapsedDesktop) {
              const label = t(item.title);
              return (
                <SidebarMenuItem key={item.title}>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton aria-label={label}>
                            {item.icon && <item.icon />}
                            <span className="sr-only">{label}</span>
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="center">
                        {label}
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent
                      className="w-56 rounded-lg"
                      side="right"
                      align="start"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                        {label}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.items.map((subItem) => (
                        <DropdownMenuItem key={subItem.title} asChild>
                          <Link
                            to={subItem.url}
                            className="cursor-pointer"
                          >
                            {t(subItem.title)}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            }

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t(item.title)}>
                      {item.icon && <item.icon />}
                      <span>{t(item.title)}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>
                              <span>{t(subItem.title)}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={t(item.title)}>
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{t(item.title)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

