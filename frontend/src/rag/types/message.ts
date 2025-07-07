// File: src/rag/types/message.ts

export type MessageType = "user" | "ai" | "system";

export interface Message {
    id?: string;
    type: MessageType;
    text: string;
    timestamp?: string;
}
