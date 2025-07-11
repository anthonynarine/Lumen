// ✅ layout/SideDrawer/sideDrawer.styles.ts
import clsx from "clsx";

/**
 * Returns the class names for the outer <aside> element of the SideDrawer.
 *
 * Applies width and theme-aware background/border styling using tokens.
 */
export const getDrawerClass = (open: boolean): string =>
  clsx(
    "fixed top-16 left-0 h-[calc(100vh-4.5rem)] transition-all duration-300 bg-card border-r border-theme shadow-md",
    open ? "w-16" : "w-64"
  );

/**
 * Returns the class names for the container that wraps the drawer toggle button.
 */
export const getToggleContainerClass = (open: boolean): string =>
  clsx(
    "flex items-center h-12 border-theme",
    open ? "justify-center" : "justify-end pr-2"
  );

/**
 * Class string for the drawer toggle button.
 * Uses theme token for text color and hover transitions.
 */
export const drawerToggleButtonClass =
  "text-primary hover:opacity-75 transition";
