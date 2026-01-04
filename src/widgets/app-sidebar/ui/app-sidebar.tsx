"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Rocket,
  Layers,
  Server,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/ui/sidebar"

const data = {
  user: {
    name: "Developer",
    email: "developer@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  teams: [
    {
      name: "Production",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Staging",
      logo: Rocket,
      plan: "Professional",
    },
    {
      name: "Development",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Activity",
          url: "/dashboard/activity",
        },
      ],
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Bot,
      items: [
        {
          title: "All Projects",
          url: "/projects",
        },
        {
          title: "Active",
          url: "/projects/active",
        },
        {
          title: "Archived",
          url: "/projects/archived",
        },
      ],
    },
    {
      title: "Deployments",
      url: "/deployments",
      icon: Rocket,
      items: [
        {
          title: "Recent",
          url: "/deployments",
        },
        {
          title: "History",
          url: "/deployments/history",
        },
        {
          title: "Scheduled",
          url: "/deployments/scheduled",
        },
      ],
    },
    {
      title: "Environments",
      url: "/environments",
      icon: Layers,
      items: [
        {
          title: "All Environments",
          url: "/environments",
        },
        {
          title: "Kubernetes",
          url: "/environments/kubernetes",
        },
        {
          title: "Virtual Machines",
          url: "/environments/vms",
        },
      ],
    },
    {
      title: "Infrastructure",
      url: "/infrastructure",
      icon: Server,
      items: [
        {
          title: "Clusters",
          url: "/infrastructure/clusters",
        },
        {
          title: "Nodes",
          url: "/infrastructure/nodes",
        },
        {
          title: "Resources",
          url: "/infrastructure/resources",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: BookOpen,
      items: [
        {
          title: "Getting Started",
          url: "/docs/getting-started",
        },
        {
          title: "API Reference",
          url: "/docs/api",
        },
        {
          title: "Guides",
          url: "/docs/guides",
        },
        {
          title: "Changelog",
          url: "/docs/changelog",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "Security",
          url: "/settings/security",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Web Application",
      url: "/projects/web-app",
      icon: Frame,
    },
    {
      name: "API Service",
      url: "/projects/api-service",
      icon: PieChart,
    },
    {
      name: "Microservices",
      url: "/projects/microservices",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
