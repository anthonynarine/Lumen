// src/layout/SideDrawer/drawerNav.styles.ts

export const getNavLinkClass = (isActive: boolean, sidebarOpen: boolean) => {
  const base = "group relative flex items-center transition-colors";

  if (sidebarOpen) {
    return `${base} px-3 py-2 mx-2 rounded-md ${
      isActive ? "bg-accent text-white" : "text-primary hover:bg-secondary"
    }`;
  }

  return `${base} px-3 py-2 mx-2 justify-center rounded-md ${
    isActive ? "bg-accent text-white" : "text-primary hover:bg-secondary"
  }`;
};


export const getLabelClass = (sidebarOpen: boolean) =>
  `ml-3 text-sm font-medium truncate whitespace-nowrap transition-all duration-300 ease-in-out ${
    !sidebarOpen ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"
  }`;

export const tooltipClass =
  "absolute left-full top-1/2 -translate-y-1/2 ml-6 tooltip-bg tooltip-text text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100";
