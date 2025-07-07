// src/layout/AppShell.tsx
import type { ReactNode } from "react";
import SideDrawer from "../SideDrawer/SideDrawer"

import TopNav from "../TopNav/TopNav";
import { SidebarProvider } from "../SideDrawer/context/sidebarProvider";
import { useSidebar } from "../SideDrawer/context/sidebarContext";


interface AppShellProps {
    children: ReactNode;
}

const Layout = ({ children }: AppShellProps) => {
    const { collapsed } = useSidebar();
    const SIDEBAR_WIDTH_EXPANDED = 16; // 16rem
    const SIDEBAR_WIDTH_COLLAPSED = 4; // 4rem
    const sidebarWidth = collapsed
        ? SIDEBAR_WIDTH_COLLAPSED
        : SIDEBAR_WIDTH_EXPANDED;

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-text-default dark:text-text-inverted">
        <SideDrawer collapsed={collapsed} />
        <div
            className="flex flex-col flex-1 overflow-hidden"
            style={{ marginLeft: `${sidebarWidth}rem` }}
        >
            <TopNav />
            <main
            className="flex-1 overflow-auto p-6 max-w-full"
            style={{ marginTop: "4rem", height: "calc(100vh - 4rem)" }}
            >
            {children}
            </main>
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
