/**
 * ChatInterface — full chat UI container.
 *
 * TODO Phase 3:
 *  [ ] Mount ChatMessage list (scrollable, auto-scroll to bottom)
 *  [ ] Mount ChatInput at the bottom
 *  [ ] Call POST /api/chat and stream tokens into a streaming message
 *  [ ] Show typing indicator while waiting for first token
 *  [ ] Handle errors (network, API quota, validation)
 *  [ ] Persist conversation history in component state
 *
 * TODO Phase 4:
 *  [ ] Sidebar with CONVERSATION_STARTERS for quick-start chips
 *  [ ] "Clear conversation" button
 *  [ ] Copy message to clipboard
 */

"use client";

export function ChatInterface() {
  // TODO Phase 3: useState for messages, loading, error
  // TODO Phase 3: useRef for scroll container
  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-white">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-center text-gray-400 text-sm py-8">
          🚧 Chat not yet implemented — Phase 3
        </p>
      </div>

      {/* Input bar */}
      <div className="border-t p-4">
        <p className="text-gray-400 text-sm text-center">
          Input coming in Phase 3
        </p>
      </div>
    </div>
  );
}
