// src/theme/ThemeToggle.tsx
import React from "react";
import { useDarkMode } from "./useDarkMode";
import { Moon, Sun } from "lucide-react";

/**
 * ThemeToggle Component
 *
 * A simple button component that allows users to manually toggle between
 * light and dark mode in the application. It leverages the `useDarkMode` hook
 * to update the `.dark` class on the <html> element and persist the preference
 * to localStorage.
 *
 * The button updates its label and icon based on the current mode.
 *
 * Usage:
 * <ThemeToggle />
 *
 * @component
 * @returns {JSX.Element} A theme toggle button
 */

const ThemeToggle = () => {
    const { isDark, toggleDarkMode } = useDarkMode();

    return (
        <button
        onClick={toggleDarkMode}
        className="p-2 rounded bg-accent text-white hover:opacity-80"
        aria-label="Toggle theme"
        >
        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
    );
};

export default ThemeToggle;

