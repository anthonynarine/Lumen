// src/components/ThemeToggle.tsx
import { useDarkMode } from "./useDarkMode";

const ThemeToggle = () => {
    const { isDark, toggleDarkMode } = useDarkMode();

    return (
        <button
        onClick={toggleDarkMode}
        className="text-sm px-3 py-1 rounded bg-accent text-white hover:opacity-80"
        >
        {isDark ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
};

export default ThemeToggle;
