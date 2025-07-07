import type { ReactNode } from "react";

interface MainContentProps {
    children: ReactNode;
    }

    const MainContent = ({ children }: MainContentProps) => {
    return (
        <main
        className="flex-grow overflow-hidden"
        style={{
            marginTop: "4rem", // Adjust if your TopNav is 4rem tall
            height: "calc(100vh - 4rem)",
        }}
        >
      {/* Centered content wrapper */}
        <div className="max-w-screen-md mx-auto">
            {children}
        </div>
    </main>
    );
};

export default MainContent;
