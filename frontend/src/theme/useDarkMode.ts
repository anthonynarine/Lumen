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
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === "undefined") return false;

        const stored = localStorage.getItem("theme");
        if (stored === "dark") {
            console.log("🔁 Loaded from localStorage: dark");
            return true;
        }
        if (stored === "light") {
            console.log("🔁 Loaded from localStorage: light");
            return false;
        }

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        console.log(`🌙 System preference: ${prefersDark ? "dark" : "light"}`);
        return prefersDark;
    });

    useEffect(() => {
        const root = document.documentElement;
        console.log("🌗 Theme changed:", isDark ? "dark" : "light");

        if (isDark) {
            root.classList.add("dark");
            root.classList.remove("light");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            root.classList.add("light");
            localStorage.setItem("theme", "light");
        }

        console.log("🧠 .classList =", root.classList.toString());
        console.log("💾 localStorage.theme =", localStorage.getItem("theme"));
    }, [isDark]);

    const toggleDarkMode = () => {
        console.log("🖱️ Toggle clicked → toggling theme...");
        setIsDark((prev) => !prev);
    };

    return { isDark, toggleDarkMode };
};