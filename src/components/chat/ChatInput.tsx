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

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled = false }: ChatInputProps) {
  // TODO Phase 3: useState for input value
  // TODO Phase 3: useRef for textarea auto-resize

  const handleSubmit = () => {
    // TODO Phase 3: call onSubmit(value) then clear input
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        placeholder="Ask about U.S. elections…"
        rows={1}
        disabled={disabled}
        aria-label="Chat message input"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors"
      >
        Send
      </button>
    </div>
  );
}
