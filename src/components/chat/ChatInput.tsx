/**
 * ChatInput — textarea + send button for composing messages.
 *
 * TODO Phase 3:
 *  [ ] Auto-resize textarea as user types
 *  [ ] Submit on Enter (Shift+Enter for newline)
 *  [ ] Disable while assistant is streaming
 *  [ ] Character / token limit indicator
 *  [ ] Accessible label + keyboard focus styles
 */

"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleInput();
        }}
        onKeyDown={handleKeyDown}
        className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] disabled:opacity-50 max-h-[200px]"
        placeholder="Ask about U.S. elections…"
        rows={1}
        disabled={disabled}
        aria-label="Chat message input"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="bg-[#B22234] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#8c1b29] focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:ring-offset-2 disabled:opacity-50 transition-colors h-[38px] flex-shrink-0"
      >
        Send
      </button>
    </div>
  );
}
