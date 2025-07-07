import type { ReactNode } from "react";

/**
 * PageContainer
 * 
 * A reusable layout wrapper component that centers its children horizontally,
 * constrains their maximum width, and applies consistent horizontal padding.
 * 
 * This component helps maintain consistent content width and alignment across
 * all pages or major UI sections, improving visual coherence and readability.
 * 
 * @param {ReactNode} children - The nested content elements to render inside the container.
 * @param {string} [maxWidthClass="max-w-screen-md"] - Optional Tailwind CSS max-width utility class
 *        to control the maximum width of the container. Defaults to medium screen width.
 * 
 * @returns JSX.Element - A div wrapping the children with specified layout constraints.
 */
interface PageContainerProps {
    children: ReactNode;
    maxWidthClass?: string;
}

const PageContainer = ({
    children,
    maxWidthClass = "max-w-screen-md",
    }: PageContainerProps) => {
    return (
        <div
        // maxWidthClass controls max width (e.g. max-w-screen-md for medium screens)
        // mx-auto centers the container horizontally
        // px-6 adds horizontal padding for consistent gutter space
        className={`${maxWidthClass} mx-auto px-8 mt-10`}
        >
        {children}
        </div>
    );
};

export default PageContainer;
