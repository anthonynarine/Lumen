// File: src/rag/hooks/useRagAgent.ts
import { useState } from "react";
import { useRagContext } from "./useRagContext";
import { askAgent } from "../../api/ragApi";
import type { Message } from "../types/message";
import { logger } from "../../utils/logger"

export const useRagAgent = () => {
  const { addMessage } = useRagContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendQuery = async (input: string) => {
    const userMsg: Message = { type: "user", text: input };
    addMessage(userMsg);

    setLoading(true);
    setError(null);

    try {
      const response = await askAgent({ question: input });
      const answer = response.answer;

      const aiMsg: Message = { type: "ai", text: "" };
      addMessage(aiMsg);

      // Typing animation effect
      let i = 0;
      const interval = setInterval(() => {
        i++;
        aiMsg.text = answer.slice(0, i);
        addMessage({ ...aiMsg }); // force re-render
        if (i >= answer.length) clearInterval(interval);
      }, 10);
    } catch (err) {
      logger.error(err)
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { sendQuery, loading, error };
};
