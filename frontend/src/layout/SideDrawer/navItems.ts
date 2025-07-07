// ✅ layout/SideDrawer/navItems.ts

import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlinePlus,
  HiOutlineClipboardList,
  HiOutlineCog,
} from "react-icons/hi";
import { PiRobotBold } from "react-icons/pi";
import { GiArtificialIntelligence } from "react-icons/gi";
import { RiRobot3Line } from "react-icons/ri";
import { GrRobot } from "react-icons/gr";

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
    onClick?: () => void;
};

/**
 * Defines the list of navigation items used in the sidebar drawer.
 *
 * Each item contains:
 * - a label shown when the drawer is expanded
 * - a href for routing
 * - an icon rendered with react-icons
 */
export const navItems: NavItem[] = [
    
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: HiOutlineHome, // Home icon
    },
    {
        label: "AI Assistant",
        icon: RiRobot3Line,
    },
    {
        label: "Patients",
        href: "/patients",
        icon: HiOutlineUser, // User/person icon
    },
    {
        label: "New Exam",
        href: "/new-exam",
        icon: HiOutlinePlus, // Plus/add icon
    },
    {
        label: "Review Reports",
        href: "/review",
        icon: HiOutlineClipboardList, // List/notes icon
    },
    {
        label: "Admin",
        href: "/admin",
        icon: HiOutlineCog, // Settings/gear icon
    },
];
