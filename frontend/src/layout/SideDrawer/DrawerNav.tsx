// src/layout/SideDrawer/DrawerNav.tsx
import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";
import { useSidebar } from "./context/sidebarContext";
import {
  getNavLinkClass,
  getLabelClass,
  tooltipClass,
} from "./drawerNav.styles";
import type { ComponentType } from "react";

/**
 * DrawerNavContent
 *
 * Shared layout for icon, label, and tooltip.
 */
const DrawerNavContent = ({
  Icon,
  label,
  sidebarOpen,
}: {
  Icon: ComponentType<{ className?: string }>;
  label: string;
  sidebarOpen: boolean;
}) => (
  <div className="flex items-center w-full">
    {/* Icon — fixed size for perfect alignment */}
    <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
      <Icon className="w-5 h-5" />
    </div>

    {/* Label — shown only when open */}
    <span className={getLabelClass(sidebarOpen)}>{label}</span>

    {/* Tooltip (hidden unless hovered and collapsed) */}
    {sidebarOpen && <span className={tooltipClass}>{label}</span>}
  </div>
);

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
