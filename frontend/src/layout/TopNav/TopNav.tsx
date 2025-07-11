// ✅ layout/TopNav/TopNav.tsx
import React from "react";
import { Link } from "react-router-dom";
import { navWrapperClass, navContainerClass, logoLinkClass } from "./topNav.style"
import ThemeToggle from "../../theme/ThemeToggle"

/**
 * TopNav Component
 *
 * A fixed top navigation bar that includes the site logo and theme toggle button.
 * It uses Tailwind utility classes powered by `@theme` tokens for light/dark styling.
 */

 const TopNav = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 px-4 bg-card text-primary border-b border-theme flex items-center justify-between shadow-sm">
      {/* App Logo */}
      <Link
        to="/"
        className="text-xl font-bold tracking-tight text-primary hover:text-accent transition"
      >
        Lumen
      </Link>

      {/* Theme toggle button */}
      <ThemeToggle />
    </header>
  );
};

export default TopNav;
