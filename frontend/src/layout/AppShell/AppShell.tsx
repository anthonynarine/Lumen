import { ReactNode } from "react";
import SideDrawer from "../SideDrawer/SideDrawer";
import TopNav from "../TopNav/TopNav";
import MainContent from "../MainContent/MainContent";
import { SidebarProvider } from "../SideDrawer/context/sidebarProvider";
import { useSidebar } from "../SideDrawer/context/sidebarContext";
import { RagProvider } from "../../rag/context/RagProvider"
import RagDrawer from "../../rag/components/RagDrawer";

interface AppShellProps {
  children: ReactNode;
}

const Layout = ({ children }: AppShellProps) => {
  const { open } = useSidebar();
  const SIDEBAR_WIDTH_EXPANDED = 16; // 16rem when open
  const SIDEBAR_WIDTH_COLLAPSED = 4;  // 4rem when collapsed
  const sidebarWidth = open ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <div className="flex h-screen w-full bg-primary text-primary">
      {/* Fixed SideDrawer overlay */}
      <SideDrawer />

      {/* Spacer block to fill the width of the fixed SideDrawer */}
      <div
        className="shrink-0 transition-all duration-300 bg-sidebar"
        style={{ width: `${sidebarWidth}rem` }}
      />

      {/* Main area: shifts based on drawer state */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <MainContent>{children}</MainContent>
        <RagDrawer />
        {/* Optional: <RagToggleButton /> if you want a floating button too */}
      </div>
    </div>
  );
};

const AppShell = ({ children }: AppShellProps) => (
  <SidebarProvider>
      <RagProvider>
        <Layout>{children}</Layout>
      </RagProvider>
  </SidebarProvider>
);

export default AppShell;