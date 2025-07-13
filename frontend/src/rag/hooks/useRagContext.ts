// File: src/rag/hooks/useRagContext.ts

import { useContext } from "react";
import { RagContext } from "../context/RagContext.";
import type { RagContextType } from "../types/ragContextType";

/**
 * useRagContext
 *
 * Custom hook to access the RAG assistant context.
 * Wraps React's useContext to enforce usage within <RagProvider>.
 *
 * @returns {RagContextType} The shared assistant state and control methods
 * @throws {Error} If called outside the context provider
 */
export const useRagContext = (): RagContextType => {
  const context = useContext(RagContext);

  if (!context) {
    throw new Error("useRagContext must be used within a <RagProvider>");
  }

  return context;
};
