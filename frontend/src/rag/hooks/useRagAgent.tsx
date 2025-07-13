// File: src/rag/hooks/useRagAgent.ts

import { useState } from "react";
import { useRagContext } from "./useRagContext";
import { askAgent } from "../../api/ragApi";
import type { Message } from "../types/message";
import { logger } from "../../utils/logger";

/**
 * useRagAgent
 *
 * Custom React hook to handle:
 * - Sending user input to the assistant API
 * - Adding messages (user + assistant) to context
 * - Managing loading and error state
 *
 * Usage:
 * const { sendQuery, loading, error } = useRagAgent();
 */
export const useRagAgent = () => {
  const { addMessage } = useRagContext(); // From RagProvider
  const [loading, setLoading] = useState(false);      // Loading state during API call
  const [error, setError] = useState<string | null>(null); // Optional error message

  /**
   * sendQuery
   *
   * Sends a user message to the RAG assistant API.
   * Automatically adds both user and assistant messages to context.
   *
   * @param input - The user's question or message (must be a string)
   */
  const sendQuery = async (input: string) => {
    const userMsg: Message = { type: "user", text: input };
    addMessage(userMsg);
    logger.info(`User: ${input}`);

    setLoading(true);
    setError(null);

    try {
      const response = await askAgent({ question: input });

      const answer = response.answer;

      if (!answer || typeof answer !== "string") {
        logger.warn("Agent returned empty or invalid answer:", answer);
        throw new Error("Received an invalid response from the assistant.");
      }

      logger.info(`Lumen: ${answer}`);

      const aiMsg: Message = { type: "ai", text: answer };
      addMessage(aiMsg);
    } catch (err) {
      logger.error("RAG error:", err);
      setError("Something went wrong while fetching a response.");
    } finally {
      setLoading(false);
    }
  };

  return { sendQuery, loading, error };
};
