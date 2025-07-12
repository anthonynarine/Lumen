// File: src/rag/context/RagContext.ts
import { createContext } from "react";
import type { RagContextType } from "../types/ragContextType";

export const RagContext = createContext<RagContextType | undefined>(undefined);
