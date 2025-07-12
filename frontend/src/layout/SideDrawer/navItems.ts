// ✅ layout/SideDrawer/navItems.ts

import {
  Home,
  User,
  Plus,
  ClipboardList,
  Settings,
  Bot,
} from "lucide-react";

import type { ComponentType } from "react";

/**
 * Represents a single item in the side navigation menu.
 *
 * @property {string} label - The text label for the navigation link.
 * @property {string} href - The route path this nav item links to.
 * @property {ComponentType<{ className?: string }>} icon - The React icon component to render.
 */
export type NavItem = {
  label: string;
  href?: string;
  icon: ComponentType<{ className?: string }>;
  actionKey?: "openRagDrawer";
};

/**
 * Defines the list of navigation items used in the sidebar drawer.
 */
export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "AI Assistant",
    icon: Bot, // Lucide's robot icon
    actionKey: "openRagDrawer",
  },
  {
    label: "Patients",
    href: "/patients",
    icon: User,
  },
  {
    label: "New Exam",
    href: "/new-exam",
    icon: Plus,
  },
  {
    label: "Review Reports",
    href: "/review",
    icon: ClipboardList,
  },
  {
    label: "Admin",
    href: "/admin",
    icon: Settings,
  },
];
