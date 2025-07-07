import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { SidebarContextProps } from "./sidebarContext.types";

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;
