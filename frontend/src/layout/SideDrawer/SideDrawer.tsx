// ✅ layout/SideDrawer/SideDrawer.tsx

import React from "react";
import { useSidebar } from "./context/sidebarContext";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Lucide icons
import {
  getDrawerClass,
  getToggleContainerClass,
  drawerToggleButtonClass,
} from "./sideDrawer.styles";

import DrawerNav from "./DrawerNav";

/**
 * SideDrawer Component
 *
 * A permanent left-hand sidebar that displays a vertical navigation list.
 * The drawer supports toggle functionality between collapsed and expanded states.
 *
 * - Uses `SidebarContext` to determine whether the drawer is open or collapsed.
 * - Renders a chevron toggle button at the top.
 * - Includes `DrawerNav` for rendering navigation links.
 * - Uses Tailwind-based dynamic class helpers to style the drawer and transitions.
 *
 * @component
 * @returns {JSX.Element} A styled sidebar with toggleable width and navigation
 */
const SideDrawer: React.FC = () => {
  const { open, toggle } = useSidebar();

  return (
    <aside className={getDrawerClass(open)}>
      <div className={getToggleContainerClass(open)}>
        <button
          onClick={toggle}
          className={`${drawerToggleButtonClass} text-primary`} // switched from text-black/dark:text-white
          aria-label="Toggle Drawer"
        >
          {open ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <DrawerNav />
    </aside>
  );
};

export default SideDrawer;
