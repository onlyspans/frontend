import type { TranslationKey } from '@/shared/lib/i18n';
import {
  Bot,
  Settings2,
  SquareTerminal,
  Rocket,
  Layers,
  Activity,
  Package,
  type LucideIcon
} from 'lucide-react';

export interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
}

export interface SidebarNavItem {
  title: TranslationKey;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: TranslationKey;
    url: string;
  }[];
}

export interface SidebarConfig {
  navMain: SidebarNavItem[];
}

export const sidebarConfig: SidebarConfig = {
  navMain: [
    {
      title: 'sidebar.navbar.dashboard',
      url: '/',
      icon: SquareTerminal,
      isActive: true
    },
    {
      title: 'sidebar.navbar.projects',
      url: '/projects',
      icon: Bot
    },
    {
      title: 'sidebar.navbar.releases',
      url: '/releases',
      icon: Package
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
        { title: 'sidebar.navbar.variables', url: '/environments/variables' }
      ]
    },
    {
      title: 'sidebar.navbar.events',
      url: '/events',
      icon: Activity
    },
    {
      title: 'sidebar.navbar.settings',
      url: '/settings',
      icon: Settings2,
      items: [
        { title: 'sidebar.navbar.general', url: '/settings/general' },
        { title: 'sidebar.navbar.security', url: '/settings/security' }
      ]
    }
  ]
};
