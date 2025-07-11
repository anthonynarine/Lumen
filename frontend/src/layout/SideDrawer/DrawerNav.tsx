// src/layout/SideDrawer/DrawerNav.tsx
import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";
import { useSidebar } from "./context/sidebarContext";
import { getNavLinkClass} from "./drawerNav.styles";

import DrawerNavContent from "./DrawerNavContent";

/**
 * DrawerNav Component
 *
 * Sidebar navigation with conditional links and hover-only tooltips.
 */
const DrawerNav = () => {
  const { open: sidebarOpen } = useSidebar();

  return (
    <nav className="mt-0" aria-label="Sidebar Navigation">
      <ul className="flex flex-col space-y-2.5">
        {navItems.map(({ label, href, icon: Icon }) => (
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
              <button className={getNavLinkClass(false, sidebarOpen)}>
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
