// tailwind.config.js
module.exports = {
  darkMode: "class", // class-based dark mode toggle
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",   // Strong Blue - main action color
          light: "#3B82F6",
          dark: "#1E40AF",
        },
        secondary: {
          DEFAULT: "#64748B",   // Slate Gray - secondary UI elements
          light: "#94A3B8",
          dark: "#475569",
        },
        background: {
          light: "#F9FAFB",     // Very light gray for backgrounds
          DEFAULT: "#FFFFFF",
          dark: "#18181B",      // Dark zinc for dark mode bg
          darkSurface: "#27272A", // Slightly lighter dark surface
        },
        text: {
          DEFAULT: "#111827",   // Dark gray - main text (neutral 900)
          muted: "#6B7280",     // Medium gray - secondary text
          inverted: "#F9FAFB",  // Light text for dark bg
        },
        success: {
          DEFAULT: "#22C55E",   // Green for success states
          light: "#4ADE80",
          dark: "#16A34A",
        },
        warning: {
          DEFAULT: "#EAB308",   // Amber for warnings
          light: "#FACC15",
          dark: "#CA8A04",
        },
        error: {
          DEFAULT: "#EF4444",   // Red for errors
          light: "#F87171",
          dark: "#B91C1C",
        },
        info: {
          DEFAULT: "#3B82F6",   // Blue for info badges/messages
          light: "#60A5FA",
          dark: "#2563EB",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Fira Code", "ui-monospace", "monospace"],
      },
      borderRadius: {
        md: "0.375rem",  // 6px - balanced rounding for inputs/buttons
        lg: "0.75rem",   // 12px - cards and containers
        xl: "1rem",      // 16px - modals and larger containers
        "2xl": "1.5rem", // 24px - large panels/drawers
      },
      boxShadow: {
        card:
          "0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)", // subtle card shadow
        input:
          "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // subtle input shadow on focus
        dropdown:
          "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)", // dropdown shadows
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)", // smooth easing
      },
      transitionDuration: {
        DEFAULT: "200ms",
        fast: "150ms",
        slow: "300ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
