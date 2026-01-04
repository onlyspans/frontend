'use client';

import * as React from 'react';
import {
  BookOpen,
  Bot,
  Settings2,
  SquareTerminal,
  Rocket,
  Layers,
  Server,
  CheckCircle2,
  Code,
  GitBranch
} from 'lucide-react';

import { NavMain } from './nav-main';
import { NavActivity } from './nav-activity';
import { NavUser } from './nav-user';
import { ProjectSwitcher } from './project-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/shared/ui/sidebar';

const data = {
  user: {
    name: 'milkylake',
    email: 'milkylake@example.com',
    avatar: 'https://github.com/shadcn.png'
  },
  projects: [
    {
      name: 'E-Commerce Platform',
      avatar: 'https://i.pinimg.com/736x/13/50/2d/13502dfd688966737d608cf45d4c79d7.jpg',
      description: 'Main production environment'
    },
    {
      name: 'Payment Gateway API',
      description: 'Staging environment for testing'
    },
    {
      name: 'User Authentication Service',
      avatar: 'https://i.pinimg.com/1200x/90/21/b2/9021b2dd69687113b052d362f1238632.jpg',
      description: 'Development branch'
    },
    {
      name: 'Analytics Dashboard',
      avatar: 'https://i.pinimg.com/736x/fa/9e/ec/fa9eec4d8e8f58b3bfa045547cbef796.jpg',
      description: 'Production monitoring system'
    },
    {
      name: 'Notification Service',
      avatar: 'https://i.pinimg.com/736x/4d/c1/6c/4dc16c590ce834ef6336b9e2e6557f1f.jpg',
      description: 'Real-time messaging backend'
    },
    {
      name: 'Content Management System',
      avatar: 'https://i.pinimg.com/1200x/4e/2e/66/4e2e6691c4b6b2e73c3d36126bbb60c8.jpg',
      description: 'Staging for content updates'
    },
    {
      name: 'Mobile App Backend',
      description: 'API for iOS and Android apps'
    }
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '/dashboard'
        },
        {
          title: 'Analytics',
          url: '/dashboard/analytics'
        },
        {
          title: 'Activity',
          url: '/dashboard/activity'
        }
      ]
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: Bot,
      items: [
        {
          title: 'All Projects',
          url: '/projects'
        },
        {
          title: 'Active',
          url: '/projects/active'
        },
        {
          title: 'Archived',
          url: '/projects/archived'
        }
      ]
    },
    {
      title: 'Deployments',
      url: '/deployments',
      icon: Rocket,
      items: [
        {
          title: 'Recent',
          url: '/deployments'
        },
        {
          title: 'History',
          url: '/deployments/history'
        },
        {
          title: 'Scheduled',
          url: '/deployments/scheduled'
        }
      ]
    },
    {
      title: 'Environments',
      url: '/environments',
      icon: Layers,
      items: [
        {
          title: 'All Environments',
          url: '/environments'
        },
        {
          title: 'Kubernetes',
          url: '/environments/kubernetes'
        },
        {
          title: 'Virtual Machines',
          url: '/environments/vms'
        }
      ]
    },
    {
      title: 'Infrastructure',
      url: '/infrastructure',
      icon: Server,
      items: [
        {
          title: 'Clusters',
          url: '/infrastructure/clusters'
        },
        {
          title: 'Nodes',
          url: '/infrastructure/nodes'
        },
        {
          title: 'Resources',
          url: '/infrastructure/resources'
        }
      ]
    },
    {
      title: 'Documentation',
      url: '/docs',
      icon: BookOpen,
      items: [
        {
          title: 'Getting Started',
          url: '/docs/getting-started'
        },
        {
          title: 'API Reference',
          url: '/docs/api'
        },
        {
          title: 'Guides',
          url: '/docs/guides'
        },
        {
          title: 'Changelog',
          url: '/docs/changelog'
        }
      ]
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '/settings/general'
        },
        {
          title: 'Team',
          url: '/settings/team'
        },
        {
          title: 'Billing',
          url: '/settings/billing'
        },
        {
          title: 'Security',
          url: '/settings/security'
        }
      ]
    }
  ],
  activities: [
    {
      title: 'Deployment successful',
      url: '/deployments',
      icon: CheckCircle2,
      time: '2 min ago',
      type: 'deployment' as const
    },
    {
      title: 'Build completed',
      url: '/projects',
      icon: Code,
      time: '15 min ago',
      type: 'build' as const
    },
    {
      title: 'Project updated',
      url: '/projects',
      icon: GitBranch,
      time: '1 hour ago',
      type: 'update' as const
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher projects={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavActivity activities={data.activities} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
