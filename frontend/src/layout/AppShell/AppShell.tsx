// src/layout/AppShell/AppShell.tsx
import { ReactNode } from "react";
import SideDrawer from "../SideDrawer/SideDrawer";
import TopNav from "../TopNav/TopNav";
import MainContent from "../MainContent/MainContent";
import { SidebarProvider } from "../SideDrawer/context/sidebarProvider";
import { useSidebar } from "../SideDrawer/context/sidebarContext";

interface AppShellProps {
  children: ReactNode;
}

const Layout = ({ children }: AppShellProps) => {
  const { open } = useSidebar();
  const SIDEBAR_WIDTH_EXPANDED = 16;
  const SIDEBAR_WIDTH_COLLAPSED = 4;
  const sidebarWidth = open ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-text-default dark:text-text-inverted">
      <SideDrawer />
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{ marginLeft: `${sidebarWidth}rem` }}
      >
        <TopNav />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
};

const AppShell = ({ children }: AppShellProps) => (
  <SidebarProvider>
    <Layout>{children}</Layout>
  </SidebarProvider>
);

export default AppShell;
