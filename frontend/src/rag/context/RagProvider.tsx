// File: src/rag/context/RagProvider.tsx

import { useState } from "react";
import { RagContext } from "./RagContext.";
import type { RagContextType } from "../types/ragContextType";
import type { Message } from "../types/message";

/**
 * RagProvider
 *
 * React context provider that wraps your app and makes the assistant state globally accessible.
 * Stores:
 * - `isOpen`: Whether the assistant drawer is visible
 * - `messages`: Array of user and AI messages
 * - Context actions: `openDrawer`, `closeDrawer`, `addMessage`, `setMessages`
 */
export const RagProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false); // Whether drawer is currently shown
  const [messages, setMessages] = useState<Message[]>([]); // Full message history

  // Open the drawer
  const openDrawer = () => setIsOpen(true);

  // Close the drawer
  const closeDrawer = () => setIsOpen(false);

  // Add a new message to the end of the list
  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  // Context value to be shared
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
