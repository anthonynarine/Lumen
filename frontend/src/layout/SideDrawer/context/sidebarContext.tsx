import { useContext } from "react";
import SidebarContext from "./sidebarProvider";
import type { SidebarContextProps } from "./sidebarContext.types";

export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
