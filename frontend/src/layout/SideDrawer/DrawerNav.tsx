// File: src/layout/SideDrawer/DrawerNav.tsx

import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";
import { useSidebar } from "./context/sidebarContext";
import { getNavLinkClass } from "./drawerNav.styles";
import DrawerNavContent from "./DrawerNavContent";
import { useRagContext } from "../../rag/hooks/useRagContext"

/**
 * DrawerNav Component
 *
 * Renders the vertical navigation list inside the collapsible SideDrawer.
 * Handles both route-based links (`href`) and interactive items (`onClick`).
 *
 * Behavior:
 * - If `href` is present: renders a <NavLink> for routing
 * - If `onClick` or label-based handler is present: renders a <button>
 * - Tooltips and labels adjust based on sidebar collapsed state
 *
 * Custom actions like opening the RAG drawer are handled inline.
 */
const DrawerNav = () => {
  const { open: sidebarOpen } = useSidebar();
  const { openDrawer } = useRagContext();

  // 🔑 Centralized action registry
  const actionMap: Record<string, () => void> = {
    openRagDrawer: openDrawer,
    // future: logoutUser: () => auth.logout(),
  };

  return (
    <nav className="mt-0" aria-label="Sidebar Navigation">
      <ul className="flex flex-col space-y-2.5">
        {navItems.map(({ label, href, icon: Icon, actionKey }) => (
          <li key={label}>
            {href ? (
              <NavLink
                to={href}
                end
                className={({ isActive }) =>
                  getNavLinkClass(isActive, sidebarOpen)
                }
              >
                <DrawerNavContent
                  Icon={Icon}
                  label={label}
                  sidebarOpen={sidebarOpen}
                />
              </NavLink>
            ) : (
              <button
                onClick={() => {
                  console.log("Bot clicked"); // debug
                  if (actionKey && actionMap[actionKey]) {
                    actionMap[actionKey]();
                  }
                }}
                className={`${getNavLinkClass(false, sidebarOpen)} cursor-pointer`}
              >
                <DrawerNavContent
                  Icon={Icon}
                  label={label}
                  sidebarOpen={sidebarOpen}
                />
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DrawerNav;