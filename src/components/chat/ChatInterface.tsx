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

import { useState, useRef, useEffect } from "react";
import type { ChatMessage as ChatMessageType } from "@/types";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { CONVERSATION_STARTERS } from "@/lib/prompts";
import { PollingLocationMap } from "../map/PollingLocationMap";
import { CalendarButton } from "../ui/CalendarButton";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [mapLocations, setMapLocations] = useState<any[]>([]);
  const [electionData, setElectionData] = useState<{name: string, date: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, mapLocations, electionData]);

  const handleFetchCivicData = async (userAddress: string) => {
    try {
      const res = await fetch(`/api/civic?address=${encodeURIComponent(userAddress)}`);
      if (res.ok) {
        const data = await res.json();
        
        if (data && data.election) {
          setElectionData({
            name: data.election.name,
            date: data.election.electionDay
          });
        }

        const locations = [];
        if (data && data.pollingLocations) {
          locations.push(...data.pollingLocations.map((loc: any) => ({
            name: loc.address.locationName || "Polling Place",
            lat: loc.latitude,
            lng: loc.longitude,
            address: `${loc.address.line1}, ${loc.address.city}, ${loc.address.state} ${loc.address.zip}`
          })));
        }
        if (data && data.earlyVoteSites) {
           locations.push(...data.earlyVoteSites.map((loc: any) => ({
            name: loc.address.locationName || "Early Voting Site",
            lat: loc.latitude,
            lng: loc.longitude,
            address: `${loc.address.line1}, ${loc.address.city}, ${loc.address.state} ${loc.address.zip}`
          })));
        }
        // Filter out locations without lat/lng
        setMapLocations(locations.filter(l => l.lat && l.lng));
      }
    } catch (e) {
      console.error("Failed to fetch civic data", e);
    }
  };

  const handleSubmit = async (content: string) => {
    const newUserMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    const newAssistantMsg: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, newUserMsg, newAssistantMsg]);
    setIsLoading(true);

    if (address && mapLocations.length === 0 && !electionData) {
      handleFetchCivicData(address);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newUserMsg], address }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          assistantContent += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newAssistantMsg.id
                ? { ...msg, content: assistantContent }
                : msg
            )
          );
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newAssistantMsg.id
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newAssistantMsg.id
            ? { ...msg, content: "Sorry, I encountered an error. Please try again.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h2 className="text-xl font-semibold text-[#1B3A6B] mb-2">Welcome to ElectionEd</h2>
            <p className="text-gray-600 mb-6 max-w-md">I can answer questions about the U.S. election process, voting methods, and registration.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
              {CONVERSATION_STARTERS.slice(0, 4).map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(starter)}
                  className="text-sm text-left p-3 border border-gray-200 rounded-lg hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-colors bg-gray-50 hover:bg-white"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}

        {(mapLocations.length > 0 || electionData) && (
          <div className="px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm mt-4">
            {electionData && (
              <div className="mb-4">
                <h3 className="font-semibold text-[#1B3A6B] text-lg">Upcoming Election Found</h3>
                <p className="text-gray-700">{electionData.name} — {electionData.date}</p>
                <CalendarButton title={electionData.name} date={electionData.date} />
              </div>
            )}
            
            {mapLocations.length > 0 && (
              <>
                <h3 className="font-semibold text-[#1B3A6B] mb-2">📍 Nearest Polling Locations</h3>
                <PollingLocationMap locations={mapLocations} />
              </>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-gray-50 flex flex-col gap-3">
        <input 
          type="text" 
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setMapLocations([]);
            setElectionData(null);
          }}
          placeholder="Optional: Enter your full address for personalized info"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
        />
        <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
      </div>
    </div>
  );
}
