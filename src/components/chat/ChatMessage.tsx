/**
 * ChatMessage — renders a single assistant or user message bubble.
 *
 * TODO Phase 3:
 *  [ ] Style user bubble (right-aligned, blue background)
 *  [ ] Style assistant bubble (left-aligned, gray background)
 *  [ ] Render markdown in assistant messages (react-markdown or similar)
 *  [ ] Show streaming cursor (.streaming-cursor) while isStreaming=true
 *  [ ] Show timestamp on hover
 *
 * TODO Phase 5:
 *  [ ] "Copy to clipboard" action on hover
 *  [ ] Thumbs up/down feedback buttons
 */

import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
          isUser
            ? "bg-blue-700 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        } ${message.isStreaming ? "streaming-cursor" : ""}`}
      >
        {/* TODO Phase 3: Replace with markdown renderer */}
        {message.content}
      </div>
    </div>
  );
}
