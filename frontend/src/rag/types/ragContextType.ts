// File: src/rag/context/types/ragContextType.ts. 

import type { Message } from "./message";

/**
 * RagContextType defines the structure of the context used for managing
 * the RAG assistant drawer state and message history.
 * 
 * Any component using this context can expect to get these properties and functions.
 */

export interface RagContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  messages: Message[];
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
}
