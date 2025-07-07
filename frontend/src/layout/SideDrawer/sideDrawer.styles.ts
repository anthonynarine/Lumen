// ✅ layout/SideDrawer/sideDrawer.styles.ts
import clsx from "clsx";

/**
 * Returns the class names for the outer <aside> element of the SideDrawer.
 * Adjusts width based on `open` state.
 *
 * - Expanded (`open === false`): wider drawer (`w-64`)
 * - Collapsed (`open === true`): narrow drawer (`w-16`)
 *
 * @param {boolean} open - Whether the drawer is collapsed (true) or expanded (false)
 * @returns {string} A Tailwind class string for the drawer container
 */
export const getDrawerClass = (open: boolean): string =>
  clsx(
    "fixed top-16 left-0 h-[calc(100vh-4.5rem)] transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-300 shadow-md dark:border-gray-700",
    open ? "w-16" : "w-64"
  );

/**
 * Returns the class names for the container that wraps the drawer toggle button.
 * Aligns the toggle button depending on drawer state.
 *
 * - Collapsed (`open === true`): center the toggle button
 * - Expanded (`open === false`): align it right with padding
 *
 * @param {boolean} open - Whether the drawer is collapsed (true) or expanded (false)
 * @returns {string} A Tailwind class string for the toggle button row
 */
export const getToggleContainerClass = (open: boolean): string =>
  clsx(
    "flex items-center h-12 dark:border-gray-700",
    open ? "justify-center" : "justify-end pr-2"
  );

/**
 * Class string for the drawer toggle button.
 * Applies consistent coloring and hover transitions.
 */
export const drawerToggleButtonClass =
  "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition";
