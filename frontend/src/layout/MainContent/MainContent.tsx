import type { ReactNode } from "react";
import PageContainer from "./PageContainer";

/**
 * MainContent
 *
 * Central content area of the app.
 * Receives correct layout offset from AppShell — no need to apply marginLeft here.
 */
interface MainContentProps {
  children: ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  return (
    <main
      className="flex-grow overflow-auto bg-content text-primary transition-all duration-300"
      style={{
        marginTop: "4rem",
        height: "calc(100vh - 4rem)",
      }}
    >
      <PageContainer>{children}</PageContainer>
    </main>
  );
};

export default MainContent;
