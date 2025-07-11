// ✅ Filename: src/layout/SideDrawer/DrawerNavContent.tsx

import type { ComponentType } from "react";
import { getLabelClass, tooltipClass } from "./drawerNav.styles";

/**
 * DrawerNavContent
 *
 * Renders the layout for an icon + label + tooltip.
 * - Label is hidden when sidebar is collapsed
 * - Tooltip appears on hover when collapsed
 */
type Props = {
  Icon: ComponentType<{ className?: string }>;
  label: string;
  sidebarOpen: boolean;
};

const DrawerNavContent = ({ Icon, label, sidebarOpen }: Props) => (
  <div className="flex items-center w-full">
    {/* Step 1: Icon + Tooltip wrapped in relative group */}
    <div className="relative group flex items-center justify-center w-6 h-6 flex-shrink-0">
      <Icon className="w-5 h-5" />
      {/* Step 2: Tooltip only shown when collapsed */}
      {sidebarOpen && <span className={tooltipClass}>{label}</span>}
    </div>

    {/* Step 3: Visible label when drawer is open */}
    <span className={getLabelClass(sidebarOpen)}>{label}</span>
  </div>
);

export default DrawerNavContent;
