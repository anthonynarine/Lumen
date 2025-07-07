

// ✅ layout/SideDrawer/SideDrawer.tsx
import React from "react";
import { useSidebar } from "./context/sidebarContext";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { getDrawerClass, getToggleContainerClass, drawerToggleButtonClass } from "./sideDrawer.styles";

type ChildProps = {
    open: boolean;
};

type Props = {
    children: React.ReactElement<ChildProps>;
};

const SideDrawer: React.FC<Props> = ({ children }) => {
    const { open, toggle } = useSidebar();

    const childrenWithProps = React.isValidElement(children)
        ? React.cloneElement(children, { open })
        : null;

    return (
        <aside className={getDrawerClass(open)}>
        {/* Toggle Button */}
        <div className={getToggleContainerClass(open)}>
            <button
            onClick={toggle}
            className={drawerToggleButtonClass}
            aria-label="Toggle Drawer"
            >
            {open ? (
                <HiOutlineChevronLeft className="w-5 h-5" />
            ) : (
                <HiOutlineChevronRight className="w-5 h-5" />
            )}
            </button>
        </div>

        {childrenWithProps}
        </aside>
    );
};

export default SideDrawer;
