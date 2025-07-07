// File: src/rag/context/RagProvider.tsx
import { useState } from "react";
import { RagContext } from "./RagContext.";
import type { RagContextType } from "../types/ragContextType";
import type { Message } from "../types/message";

export const RagProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const value: RagContextType = {
    isOpen,
    openDrawer,
    closeDrawer,
    messages,
    addMessage,
    setMessages,
  };

  return <RagContext.Provider value={value}>{children}</RagContext.Provider>;
};
