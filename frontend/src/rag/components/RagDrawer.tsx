// File: src/rag/components/RagDrawer.tsx
import { useEffect, useRef } from "react";
import { useRagContext } from "../hooks/useRagContext";
import MessageList from "./Messages";
import InputBox from "./InputBox";

const RagDrawer = () => {
    const { isOpen, closeDrawer, messages } = useRagContext();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full max-h-[50vh] bg-black text-white border-t border-gray-700 shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <span className="text-base font-semibold">RAG Assistant</span>
            <button onClick={closeDrawer} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
            <MessageList />
            <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-700">
            <InputBox />
        </div>
        </div>
    );
};

export default RagDrawer;
