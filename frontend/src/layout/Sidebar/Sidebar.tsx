// src/layout/Sidebar.tsx
import React from "react";

interface SidebarProps {
  collapsed: boolean;
}

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "🏠" },
    { label: "Patients", href: "/patients", icon: "🧍" },
    { label: "New Exam", href: "/new-exam", icon: "➕" },
    { label: "Review Reports", href: "/review", icon: "📝" },
    { label: "Admin", href: "/admin", icon: "⚙️" },
];

const Sidebar = ({ collapsed }: SidebarProps) => {
    return (
        <nav
        aria-label="Main Navigation"
        style={{
            top: "4rem",
            height: "calc(100vh - 4rem)",
            position: "fixed",
            left: 0,
            width: collapsed ? "4rem" : "16rem",
            transition: "width 300ms ease-in-out",
            zIndex: 30,
        }}
        className="bg-zinc-900 text-white border-r border-zinc-700 shadow-lg flex flex-col overflow-hidden"
        >
        <div className="flex items-center justify-center h-16 border-b border-zinc-800 select-none">
            {collapsed ? (
            <span className="text-xl font-bold">L</span>
            ) : (
            <span className="text-2xl font-bold tracking-wide">Lumen</span>
            )}
        </div>

        <ul className="flex flex-col flex-1 mt-4 space-y-1">
            {navItems.map(({ label, href, icon }) => (
            <li key={href}>
                <a
                href={href}
                className={`flex items-center ${
                    collapsed ? "justify-center" : "gap-3 px-4 py-3"
                } hover:bg-zinc-700 transition-colors h-12 select-none truncate`}
                >
                <span className="text-lg">{icon}</span>
                {!collapsed && <span>{label}</span>}
                </a>
            </li>
            ))}
        </ul>
        </nav>
    );
};

export default Sidebar;
