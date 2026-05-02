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
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
          isUser
            ? "bg-[#1B3A6B] text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        <div className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : ""} ${message.isStreaming ? "streaming-cursor" : ""}`}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className={isUser ? "text-blue-200 underline" : "text-[#B22234] underline"} />
              ),
              p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              h3: ({ node, ...props }) => <h3 className="font-semibold mt-3 mb-1" {...props} />,
              h4: ({ node, ...props }) => <h4 className="font-semibold mt-2 mb-1" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
