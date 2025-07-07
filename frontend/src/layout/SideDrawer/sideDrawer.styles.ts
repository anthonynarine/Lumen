// ✅ layout/SideDrawer/sideDrawer.styles.ts
import clsx from "clsx";

export const getDrawerClass = (open: boolean) =>
    clsx(
        "fixed top-16 left-0 h-[calc(100vh-4.5rem)] transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-300 shadow-md dark:border-gray-700",
        open ? "w-16" : "w-64"
    );

export const getToggleContainerClass = (open: boolean) =>
    clsx(
        "flex items-center h-12  dark:border-gray-700",
        open ? "justify-center" : "justify-end pr-2"
    );

export const drawerToggleButtonClass =
    "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition";
