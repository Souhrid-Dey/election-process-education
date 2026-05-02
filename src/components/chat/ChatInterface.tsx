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
  const [selectedCoords, setSelectedCoords] = useState<{lat: string, lng: string} | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cachedCivicContext, setCachedCivicContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Avoid fetching if address is exactly equal to a suggestion (meaning they just clicked it)
      if (address.length > 3 && showSuggestions) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=10&countrycodes=us`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data);
          }
        } catch (e) {
          console.error("Autocomplete failed", e);
        }
      } else if (address.length <= 3) {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timeoutId);
  }, [address, showSuggestions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toString();
          const lng = position.coords.longitude.toString();
          setSelectedCoords({ lat, lng });
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress("Your Current Location");
            }
          } catch (e) {
            console.error("Reverse geocoding failed", e);
            setAddress("Your Current Location");
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not get your location. Please check your browser permissions.");
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleFetchCivicData = async (userAddress: string) => {
    try {
      let url = `/api/civic?address=${encodeURIComponent(userAddress)}`;
      if (selectedCoords) {
        url += `&lat=${selectedCoords.lat}&lng=${selectedCoords.lng}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const locations: any[] = [];
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
        const validLocations = locations.filter(l => l.lat && l.lng);
        const fetchedElectionData = data && data.election ? {
          name: data.election.name,
          date: data.election.electionDay
        } : null;

        if (validLocations.length > 0 || fetchedElectionData) {
          // Build a compact civic context summary once and cache it
          const contextLines: string[] = [`User's registered address: ${userAddress}`];
          if (fetchedElectionData) {
            contextLines.push(`Upcoming election: ${fetchedElectionData.name} on ${fetchedElectionData.date}`);
          }
          if (validLocations.length > 0) {
            contextLines.push(`Polling/voting locations near user:`);
            validLocations.forEach(loc => contextLines.push(`  - ${loc.name}: ${loc.address}`));
          }
          if (data.state && data.state.length > 0) {
            const admin = data.state[0]?.electionAdministrationBody;
            if (admin?.electionInfoUrl) contextLines.push(`State election info: ${admin.electionInfoUrl}`);
            if (admin?.electionRegistrationUrl) contextLines.push(`Voter registration: ${admin.electionRegistrationUrl}`);
          }
          if (data.representatives && data.representatives.length > 0) {
            contextLines.push(`Elected officials:`);
            data.representatives.slice(0, 15).forEach((office: any) => {
              if (office.officials?.length > 0) {
                contextLines.push(`  - ${office.name}: ${office.officials.map((o: any) => o.name).join(", ")}`);
              }
            });
          }
          if (data.contests && data.contests.length > 0) {
            contextLines.push(`Ballot contests:`);
            data.contests.slice(0, 5).forEach((c: any) => {
              contextLines.push(`  - ${c.office || c.referendumTitle || "Contest"}`);
            });
          }
          const compactContext = contextLines.join("\n");
          setCachedCivicContext(compactContext);

          const widgetMsg: ChatMessageType = {
            id: Date.now().toString(),
            role: "widget",
            content: "",
            timestamp: new Date(),
            widgetData: {
              type: "civic-data",
              electionData: fetchedElectionData,
              mapLocations: validLocations,
              userLocation: selectedCoords ? { lat: parseFloat(selectedCoords.lat), lng: parseFloat(selectedCoords.lng), address: userAddress } : null,
            }
          };
          setMessages(prev => [...prev, widgetMsg]);
        } else {
          // Provide feedback if no data was found
          const errorMsg: ChatMessageType = {
            id: Date.now().toString(),
            role: "assistant",
            content: "I couldn't find specific election data for that location. Please make sure you enter a **full residential street address** (e.g., 1263 Pacific Ave, Kansas City, KS) so I can find your exact polling place.",
            timestamp: new Date(),
            isStreaming: false,
          };
          setMessages(prev => [...prev, errorMsg]);
        }
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

    const lastWidget = messages.findLast(m => m.role === "widget" && m.widgetData?.type === "civic-data");
    if (address && !lastWidget) {
      handleFetchCivicData(address);
    }

    try {
      const mapLocs = lastWidget ? lastWidget.widgetData?.mapLocations : [];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newUserMsg],
          civicContext: cachedCivicContext || (address ? `User's address: ${address}` : null),
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const errMsg = errBody?.error || `HTTP ${response.status}`;
        console.error("Chat API returned error:", errMsg);
        // Show error inline in the chat rather than crashing
        setMessages(prev => prev.map(m =>
          m.isStreaming ? { ...m, content: `⚠️ Error: ${errMsg}`, isStreaming: false } : m
        ));
        setIsLoading(false);
        return;
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
          messages.map((msg) => 
            msg.role === "widget" && msg.widgetData?.type === "civic-data" ? (
              <div key={msg.id} className="px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm mt-4">
                {msg.widgetData.electionData && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-[#1B3A6B] text-lg">Upcoming Election Found</h3>
                    <p className="text-gray-700">{msg.widgetData.electionData.name} — {msg.widgetData.electionData.date}</p>
                    <CalendarButton title={msg.widgetData.electionData.name} date={msg.widgetData.electionData.date} />
                  </div>
                )}
                
                {msg.widgetData.mapLocations && msg.widgetData.mapLocations.length > 0 && (
                  <>
                    <h3 className="font-semibold text-[#1B3A6B] mb-2">📍 Nearest Polling Locations</h3>
                    <PollingLocationMap locations={msg.widgetData.mapLocations} userLocation={msg.widgetData.userLocation} />
                  </>
                )}
              </div>
            ) : (
              <ChatMessage key={msg.id} message={msg} />
            )
          )
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-gray-50 flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700 mb-[-4px]">Where are you registered to vote?</label>
        <div className="flex gap-2 w-full items-center relative">
          <button 
            onClick={handleGeolocation}
            className="px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1 whitespace-nowrap"
            title="Use Device GPS"
          >
            <span>📍</span> Auto-Locate
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setSelectedCoords(null);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (address.length > 3) setShowSuggestions(true);
              }}
              placeholder="Or type your address manually..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <div 
                    key={idx}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-0"
                    onClick={() => {
                      setAddress(s.display_name);
                      setSelectedCoords({ lat: s.lat, lng: s.lon });
                      setShowSuggestions(false);
                      setSuggestions([]);
                    }}
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => handleFetchCivicData(address)}
            disabled={!address}
            className="px-4 py-2 bg-[#1B3A6B] text-white text-sm font-medium rounded-lg hover:bg-[#142a4a] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find polling location
          </button>
        </div>
        <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
      </div>
    </div>
  );
}
