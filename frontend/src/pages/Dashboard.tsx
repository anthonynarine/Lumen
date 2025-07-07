// src/pages/Dashboard.tsx (or wherever your test is)
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-14 sm:h-20 px-4 sm:px-6">
        {/* Logo / Title */}
        <Link
          to="/"
          className="text-lg sm:text-xl font-bold tracking-wide text-gray-900 dark:text-white no-underline"
        >
          Lumen 
        </Link>

      </div>
    </header>
  );
}
