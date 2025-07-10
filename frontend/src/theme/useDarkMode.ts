import { useEffect, useState } from "react";

/**
 * useDarkMode
 *
 * A custom React hook that manages light/dark theme preference for the application.
 * It stores the user's preference in localStorage and applies the appropriate theme
 * by adding or removing the `dark` class on the root <html> element.
 *
 * Behavior:
 * - If a theme is saved in localStorage → it takes priority
 * - Otherwise → it defaults to system preference (using prefers-color-scheme)
 * - Updates <html class="dark"> accordingly
 *
 * @returns {{
 *   isDark: boolean,
 *   toggleDarkMode: () => void
 * }} An object containing the current dark mode state and a toggle function
 */
export const useDarkMode = () => {
  // Step 1: Initialize dark mode state
    const [isDark, setIsDark] = useState(() => {
        // Check if user preference is saved
        const stored = localStorage.getItem("theme");
        if (stored) return stored === "dark";

        // Fallback to system preference if no stored value
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

  // Step 2: Apply dark mode class on <html> whenever state changes
    useEffect(() => {
        const root = document.documentElement;

        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    // Step 3: Manual toggle handler
    const toggleDarkMode = () => setIsDark((prev) => !prev);

    return { isDark, toggleDarkMode };
};
