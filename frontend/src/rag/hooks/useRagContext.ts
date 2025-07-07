// File: useRagContext.ts
import { useContext } from "react";
import { RagContext } from "../context/RagContext.";


export const useRagContext = () => {
    const context = useContext(RagContext);
    if (!context) throw new Error("useRagContext must be used within RagProvider");
    return context;
};
