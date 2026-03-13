"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface RefinementMessage {
  role: "user" | "assistant";
  text: string;
}

interface RefinementChatProps {
  history: RefinementMessage[];
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function RefinementChat({ history, onSend, disabled }: RefinementChatProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history.length]);

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Minimal chat history */}
      {history.length > 0 && (
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`text-xs px-3 py-2 rounded-xl max-w-[85%] ${
                msg.role === "user"
                  ? "self-end bg-teal-100 text-teal-800"
                  : "self-start bg-muted text-muted-foreground"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 items-end">
        <Textarea
          placeholder="Adjust portions or ingredients..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={disabled}
          rows={1}
          className="min-h-[44px] max-h-24 resize-none rounded-xl text-sm"
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="h-[44px] w-[44px] rounded-xl shrink-0 bg-teal-600 hover:bg-teal-700"
          aria-label="Send refinement"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
