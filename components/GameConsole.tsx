"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type GameConsoleProps = {
  messages: string[];
};

export function GameConsole({ messages }: GameConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 w-[calc(24rem+1rem)] pl-4 bg-card border border-border rounded-lg font-mono text-sm"
    >
      <div
        ref={consoleRef}
        className="h-40 py-2 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
      >
        {messages.map((message, index) => (
          <div key={index} className="whitespace-pre-wrap break-words">
            <span className="text-muted-foreground">&gt; Console: </span>
            {message}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
