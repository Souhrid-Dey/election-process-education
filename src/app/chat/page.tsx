import { ChatInterface } from "@/components/chat/ChatInterface";

export const metadata = {
  title: "Chat with Election Assistant | Election Process Education",
  description: "Ask questions about voting, registration, and the U.S. election process.",
};

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-140px)] flex flex-col">
      <h1 className="text-3xl font-bold text-[#1B3A6B] mb-6">Ask an Election Expert</h1>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
