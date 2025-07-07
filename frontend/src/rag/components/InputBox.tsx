// File: src/rag/components/InputBox.tsx
import { useState } from "react";
import { useRagAgent } from "../hooks/useRagAgent";

const InputBox = () => {
    const [input, setInput] = useState("");
    const { sendQuery, loading } = useRagAgent();

    const handleSend = () => {
        if (!input.trim()) return;
        sendQuery(input.trim());
        setInput("");
    };

    return (
        <div className="flex items-center gap-2 p-4 bg-black">
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 resize-none bg-zinc-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Ask me a question..."
            rows={1}
            disabled={loading}
        />
        <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-cyan-500 text-black font-semibold px-4 py-2 rounded-lg disabled:opacity-40 hover:bg-cyan-400"
        >
            Send
        </button>
        </div>
    );
};

export default InputBox;
