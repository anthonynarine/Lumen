// ✅ layout/SideDrawer/SideDrawer.tsx

import React from "react";
import { useSidebar } from "./context/sidebarContext";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
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
  // Access open state and toggle function from context
  const { open, toggle } = useSidebar();

  return (
    // Sidebar container with width and layout styles based on `open`
    <aside className={getDrawerClass(open)}>
      {/* Toggle Button Row */}
      <div className={getToggleContainerClass(open)}>
        <button
          onClick={toggle}
          className={drawerToggleButtonClass}
          aria-label="Toggle Drawer"
        >
          {/* Icon changes direction depending on drawer state */}
          {open ? (
            <HiOutlineChevronLeft className="w-5 h-5 text-black dark:text-white" />
          ) : (
            <HiOutlineChevronRight className="w-5 h-5 text-black dark:text-white" />
          )}
        </button>
      </div>

      {/* Sidebar Navigation Menu */}
      <DrawerNav />
    </aside>
  );
};

export default SideDrawer;
