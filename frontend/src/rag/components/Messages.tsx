// File: src/rag/components/MessageList.tsx
import { useRagContext } from "../hooks/useRagContext";
import type { Message } from "../types/message";

const MessageList = () => {
    const { messages } = useRagContext();

    return (
        <div className="flex flex-col gap-2 text-sm font-mono">
        {messages.map((msg: Message, idx: number) => (
            <div key={idx} className="flex">
            <span
                className={`mr-2 font-semibold min-w-[64px] ${
                msg.type === "user" ? "text-green-400" : "text-cyan-400"
                }`}
            >
                {msg.type === "user" ? "You:" : "RAG:"}
            </span>
            <span className="text-white whitespace-pre-wrap">{msg.text}</span>
            </div>
        ))}
        </div>
    );
};

export default MessageList;
