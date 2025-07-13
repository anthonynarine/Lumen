// File: src/rag/components/MessageList.tsx

import { useRagContext } from "../hooks/useRagContext";
import TypingMessage from "./TypingMessage";
import type { Message } from "../types/message";

/**
 * MessageList Component
 *
 * Displays the list of messages exchanged between the user and the AI assistant.
 * Automatically styles each message type differently (user, AI, system).
 * Renders the TypingMessage animation if the assistant is still typing the last response.
 */
const MessageList = () => {
  const { messages } = useRagContext(); // Get current chat messages from context

  return (
    <div className="flex flex-col gap-3 text-sm font-mono leading-relaxed px-1">
      {messages.map((msg: Message, idx) => {
        const isLast = idx === messages.length - 1;
        const isAI = msg.type === "ai";
        const isUser = msg.type === "user";
        const isSystem = msg.type === "system";

        return (
          <div key={msg.id ?? idx} className="flex items-start gap-2">
            {/* Label: 'You:', 'Lumen:', or 'System:' */}
            <span
              className={`shrink-0 font-semibold ${
                isUser
                  ? "text-green-400"
                  : isAI
                  ? "text-cyan-400"
                  : "text-yellow-400"
              }`}
            >
              {isUser ? "You:" : isAI ? "Lumen:" : "System:"}
            </span>

            {/* Message Body:
                - If it's the latest AI message, use TypingMessage to animate the text
                - Otherwise, render static message text */}
            {isAI && isLast ? (
              <TypingMessage key={msg.text} text={msg.text || ""} />
            ) : (
              <span className="text-white whitespace-pre-wrap break-words">
                {msg.text}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;

