// File: src/rag/components/TypingMessage.tsx

import { useEffect, useRef, useState } from "react";

/**
 * Props for TypingMessage component.
 */
interface TypingMessageProps {
  text: string;       // The full text to animate
  speed?: number;     // Typing speed in ms per character (default: 15)
  onDone?: () => void; // Optional callback when typing is complete
}

/**
 * TypingMessage Component
 *
 * Simulates a "typing" effect by gradually revealing characters from the AI's response.
 * Used only for the most recent AI message to enhance user experience.
 */
const TypingMessage = ({ text = "", speed = 15, onDone }: TypingMessageProps) => {
  const [charCount, setCharCount] = useState(0); // How many characters are visible so far
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Runs whenever a new `text` is passed in.
   * Starts a setInterval loop to incrementally reveal characters.
   */
  useEffect(() => {
    setCharCount(0); // Reset animation for new message

    intervalRef.current = setInterval(() => {
      setCharCount((prev) => {
        const next = prev + 1;

        // When finished, stop interval and trigger onDone
        if (next >= text.length) {
          clearInterval(intervalRef.current!);
          onDone?.();
        }

        return next;
      });

      // Auto-scroll as new characters appear
      containerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, speed);

    // Cleanup: clear interval if component unmounts or message changes
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, onDone]);

  return (
    <span
      ref={containerRef}
      className="text-white whitespace-pre-wrap break-words relative font-normal leading-relaxed"
    >
      {/* Revealed characters */}
      {text.slice(0, charCount)}

      {/* Blinking cursor */}
      <span className="inline-block w-[1px] h-[1.1em] bg-white animate-blink ml-0.5" />
    </span>
  );
};

export default TypingMessage;

