// File: src/rag/components/RagDrawer.tsx

import { useEffect, useRef } from "react";
import { useRagContext } from "../hooks/useRagContext";
import MessageList from "./Messages";
import InputBox from "./InputBox";
import { X } from "lucide-react";

/**
 * RagDrawer Component
 *
 * A floating, slide-in assistant drawer UI.
 * Contains the conversation history (`MessageList`) and input box (`InputBox`).
 * Listens to global drawer open/close state via context.
 */
const RagDrawer = () => {
  const { isOpen, closeDrawer, messages } = useRagContext(); // drawer visibility, close handler, and messages
  const bottomRef = useRef<HTMLDivElement>(null); // used to auto-scroll to bottom when new messages arrive

  /**
   * Scrolls to the latest message when messages update.
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`fixed bottom-4 right-4 h-[50vh] w-[45vw] z-50 flex flex-col
                  backdrop-blur-md bg-black/70 border border-theme shadow-2xl
                  rounded-xl overflow-hidden transition-all duration-500 ease-in-out
                  ${
                    isOpen
                      ? "translate-y-0 translate-x-0 opacity-100"
                      : "translate-y-4 translate-x-4 opacity-0 pointer-events-none"
                  }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-theme bg-black/80">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-base">
          <span>Lumen</span>
        </div>
        <button
          onClick={closeDrawer}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Close assistant"
        >
          <X size={18} />
        </button>
      </div>

      {/* Message Area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3
                    scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent
                    scroll-smooth"
        style={{ backgroundColor: "#0E0E0E" }}
      >
        <MessageList />
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-theme bg-black/70">
        <InputBox />
      </div>
    </div>
  );
};

export default RagDrawer;

