// ─────────────────────────────────────────────────────────────
// Core domain types for the Election Process Education app
// ─────────────────────────────────────────────────────────────

// Chat & AI

export type MessageRole = "user" | "assistant" | "widget";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  /** Set to true while a streaming response is in progress */
  isStreaming?: boolean;
  widgetData?: {
    type: "civic-data";
    electionData?: { name: string; date: string } | null;
    mapLocations?: any[];
    userLocation?: { lat: number; lng: number; address?: string } | null;
  };
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// Election domain

export type ElectionType =
  | "presidential"
  | "midterm"
  | "primary"
  | "runoff"
  | "special"
  | "local";

export type VotingMethod = "in-person" | "early-voting" | "mail-in" | "absentee";

export interface ElectionEvent {
  id: string;
  title: string;
  date: string; // ISO 8601
  description: string;
  type: ElectionType;
  phase: ElectionPhase;
}

export type ElectionPhase =
  | "registration"
  | "primary"
  | "convention"
  | "general"
  | "post-election";

export interface VotingStep {
  id: number;
  title: string;
  description: string;
  icon: string;       // Emoji or icon name — TBD in Phase 2
  details: string[];
  links?: { label: string; url: string }[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;       // Tailwind bg class
  suggestedQuestions: string[];
}

// API request / response shapes

export interface ChatApiRequest {
  messages: { role: MessageRole; content: string }[];
  conversationId?: string;
}

export interface ChatApiError {
  error: string;
  code?: string;
}
