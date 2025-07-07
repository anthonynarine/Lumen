import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";
import { useSidebar } from "./context/sidebarContext";

/**
 * DrawerNav Component
 *
 * Renders a vertical navigation menu inside the collapsible SideDrawer.
 * It dynamically adjusts layout based on the `open` state from SidebarContext.
 *
 * Behavior:
 * - When `open === true` (drawer expanded):
 *    - Icons and labels are shown
 *    - Tooltip is hidden
 * - When `open === false` (drawer collapsed):
 *    - Only icons are visible
 *    - Tooltip appears on hover
 *
 * @component
 * @returns {JSX.Element} A sidebar navigation list with responsive behavior
 */
const DrawerNav = () => {
  const { open } = useSidebar(); // open === true => drawer expanded

    return (
        <nav className="mt-0" aria-label="Sidebar Navigation">
            <ul className="flex flex-col space-y-2.5">
                {navItems.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                    <NavLink
                    to={href}
                    className={({ isActive }) =>
                        `group relative flex items-center py-2 transition-colors rounded-md
                        ${!open ? "px-9 justify-start" : "px-5"}
                        ${
                        isActive
                            ? "bg-black-200 dark:bg-black-700 text-black dark:text-white"
                            : "text-black-700 dark:text-black-300 hover:bg-black-100 dark:hover:bg-black-800"
                        }`
                    }
                    >
                    {/* Icon is always visible */}
                    <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                        <Icon className="w-5.5 h-5.5" />
                    </div>

                    {/* Label: visible only when drawer is collapsed */}
                    <span
                        className={`ml-3 text-sm font-medium truncate whitespace-nowrap transition-all duration-300 ease-in-out
                        ${!open ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"}`}
                    >
                        {label}
                    </span>

                    {/* Tooltip: visible only when drawer is collapsed and hovered */}
                    {open && (
                        <span
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        >
                        {label}
                        </span>
                    )}
                    </NavLink>
                </li>
                ))}
            </ul>
        </nav>
    );
};

export default DrawerNav;
