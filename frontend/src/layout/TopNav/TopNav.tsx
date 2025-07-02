// src/layout/TopNav.tsx
import React from "react";
import { useSidebar } from "../context/sidebarContext";

const TopNav = () => {
    const { toggle } = useSidebar();

    return (
        <header
        className="
            fixed top-0 left-0 right-0 h-16
            bg-white dark:bg-zinc-900
            border-b border-gray-200 dark:border-zinc-700
            flex items-center justify-between
            px-6
            z-40
        "
        >
        <button
            onClick={toggle}
            aria-label="Toggle sidebar"
            className="text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary rounded hover:text-primary"
        >
            <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
            >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
        </button>

        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lumen Vascular Reporting
        </h1>

        <div className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </header>
    );
};

export default TopNav;
