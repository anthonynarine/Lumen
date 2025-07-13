// File: src/rag/components/InputBox.tsx

import { useState, useRef } from "react";
import { useRagAgent } from "../hooks/useRagAgent";
import { ArrowUpCircle } from "lucide-react";

/**
 * InputBox Component
 *
 * Renders a styled textarea input for the user to enter their message,
 * and a send button that triggers the RAG assistant query.
 *
 * Features:
 * - Auto-expanding textarea height
 * - Disables input during loading
 * - Clears text after sending
 */
const InputBox = () => {
  const [input, setInput] = useState(""); // User's text input
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref to control textarea height

  const { sendQuery, loading } = useRagAgent(); // Custom hook to send message to assistant

  /**
   * Handles sending the message.
   * - Sends trimmed input
   * - Clears input field
   * - Resets textarea height
   */
  const handleSend = () => {
    if (!input.trim()) return;
    sendQuery(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  /**
   * Handles typing input, auto-resizes the textarea
   */
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;
    setInput(e.target.value);
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  return (
    <div className="relative px-4 py-3 bg-[#0E0E0E] border-t border-theme">
      <textarea
        ref={textareaRef}
        value={input}
        onInput={handleInput}
        className="w-full pr-12 bg-[#1a1a1a] border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-cyan-500
                    max-h-[160px] overflow-hidden leading-relaxed"
        placeholder="Ask me a question..."
        rows={1}
        disabled={loading}
      />
      <button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        className="absolute right-6 top-7/14 -translate-y-1/2 text-white hover:text-cyan-300 transition-all disabled:opacity-40 active:scale-95"
        aria-label="Send message"
      >
        <ArrowUpCircle size={24} strokeWidth={2.2} />
      </button>
    </div>
  );
};

export default InputBox;
