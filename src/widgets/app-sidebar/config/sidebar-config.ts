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
  GitBranch,
  type LucideIcon
} from 'lucide-react';

export interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
}

export interface SidebarProject {
  name: string;
  avatar?: string;
  description: string;
}

export interface SidebarNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface SidebarActivity {
  title: string;
  url: string;
  icon: LucideIcon;
  time: string;
  type: 'deployment' | 'build' | 'update';
}

export interface SidebarConfig {
  user: SidebarUser;
  projects: SidebarProject[];
  navMain: SidebarNavItem[];
  activities: SidebarActivity[];
}

export const sidebarConfig: SidebarConfig = {
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
      title: 'sidebar.navbar.dashboard',
      url: '/',
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: 'sidebar.navbar.overview', url: '/' },
        { title: 'sidebar.navbar.analytics', url: '/analytics' },
        { title: 'sidebar.navbar.activity', url: '/activity' }
      ]
    },
    {
      title: 'sidebar.navbar.projects',
      url: '/projects',
      icon: Bot
    },
    {
      title: 'sidebar.navbar.deployments',
      url: '/deployments',
      icon: Rocket,
      items: [
        { title: 'sidebar.navbar.recent', url: '/deployments' },
        { title: 'sidebar.navbar.history', url: '/deployments/history' },
        { title: 'sidebar.navbar.scheduled', url: '/deployments/scheduled' }
      ]
    },
    {
      title: 'sidebar.navbar.environments',
      url: '/environments',
      icon: Layers,
      items: [
        { title: 'sidebar.navbar.allEnvironments', url: '/environments' },
        { title: 'sidebar.navbar.kubernetes', url: '/environments/kubernetes' },
        { title: 'sidebar.navbar.virtualMachines', url: '/environments/vms' }
      ]
    },
    {
      title: 'sidebar.navbar.infrastructure',
      url: '/infrastructure',
      icon: Server,
      items: [
        { title: 'sidebar.navbar.clusters', url: '/infrastructure/clusters' },
        { title: 'sidebar.navbar.nodes', url: '/infrastructure/nodes' },
        { title: 'sidebar.navbar.resources', url: '/infrastructure/resources' }
      ]
    },
    {
      title: 'sidebar.navbar.documentation',
      url: '/docs',
      icon: BookOpen,
      items: [
        { title: 'sidebar.navbar.gettingStarted', url: '/docs/getting-started' },
        { title: 'sidebar.navbar.apiReference', url: '/docs/api' },
        { title: 'sidebar.navbar.guides', url: '/docs/guides' },
        { title: 'sidebar.navbar.changelog', url: '/docs/changelog' }
      ]
    },
    {
      title: 'sidebar.navbar.settings',
      url: '/settings',
      icon: Settings2,
      items: [
        { title: 'sidebar.navbar.general', url: '/settings/general' },
        { title: 'sidebar.navbar.team', url: '/settings/team' },
        { title: 'sidebar.navbar.billing', url: '/settings/billing' },
        { title: 'sidebar.navbar.security', url: '/settings/security' }
      ]
    }
  ],
  activities: [
    {
      title: 'Deployment successful',
      url: '/deployments',
      icon: CheckCircle2,
      time: 'sidebar.recentActivity.time2MinAgo',
      type: 'deployment'
    },
    {
      title: 'Build completed',
      url: '/projects',
      icon: Code,
      time: 'sidebar.recentActivity.time15MinAgo',
      type: 'build'
    },
    {
      title: 'Project updated',
      url: '/projects',
      icon: GitBranch,
      time: 'sidebar.recentActivity.time1HourAgo',
      type: 'update'
    }
  ]
};

