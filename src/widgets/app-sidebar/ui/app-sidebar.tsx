import * as React from 'react';
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
import { sidebarConfig } from '../config/sidebar-config';
import { oidcUserManager } from '@/shared/auth/oidc';
import type { SidebarUser } from '../config/sidebar-config';

function toSidebarUser(user: Awaited<ReturnType<typeof oidcUserManager.getUser>> | undefined): SidebarUser | undefined {
  if (!user) {
    return undefined
  }

  const profile = user?.profile;

  console.log(profile);
  console.log(profile?.name,
    profile?.preferred_username,
    profile?.nickname);

  const email = (profile?.email as string);
  const name =
    profile?.name ||
    profile?.preferred_username ||
    profile?.nickname ||
    email;
  const avatar = (profile?.picture as string | undefined);

  console.log(name);

  return { name, email, avatar };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<SidebarUser | undefined>();

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      const current = await oidcUserManager.getUser();
      if (cancelled) return;
      if (!current) return;
      setUser(toSidebarUser(current));
    })();

    const onUserLoaded = (loadedUser: unknown) => {
      if (cancelled) return;
      // oidc-client-ts passes a User here; we keep it loose to avoid importing types.
      setUser(toSidebarUser(loadedUser as any));
    };

    const onUserUnloaded = () => setUser(undefined);

    oidcUserManager.events.addUserLoaded(onUserLoaded);
    oidcUserManager.events.addUserUnloaded(onUserUnloaded);

    return () => {
      cancelled = true;
      oidcUserManager.events.removeUserLoaded(onUserLoaded);
      oidcUserManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarConfig.navMain} />
        <NavActivity />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
