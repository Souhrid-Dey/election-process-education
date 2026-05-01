<div align="center">

![Election Process Education](public/assets/project-banner.webp)

# Election Process Education

### An AI-Powered Civic Assistant for Understanding U.S. Elections

[![Hackathon](https://img.shields.io/badge/Hackathon-PromptWars%20April%202026-blue?style=flat-square)](https://hack2skill.com)
[![Challenge](https://img.shields.io/badge/Challenge-2-orange?style=flat-square)]()
[![Organizers](https://img.shields.io/badge/Organized%20by-Hack2Skill%20%26%20Google%20for%20Developers-4285F4?style=flat-square&logo=google)](https://developers.google.com)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square)]()
[![License](https://img.shields.io/badge/Use-Educational%20Only-green?style=flat-square)]()

</div>

---

> **Disclaimer:** This project is developed as part of the **PromptWars April 2026 — Challenge 2**, organized by [Hack2Skill](https://hack2skill.com) and the [Google for Developers](https://developers.google.com) community. It is **not intended for production or commercial use** and is provided solely for **educational and demonstration purposes**.

---

## Overview

**Election Process Education** is an interactive, AI-powered civic assistant that helps users understand the U.S. election process — from voter registration deadlines and polling locations to how the Electoral College works and what to expect on election day.

The assistant is designed to be:
- **Nonpartisan** — it never expresses opinions on candidates, parties, or policies
- **Accessible** — clear language, structured answers, and a streamlined UI for all users
- **Data-driven** — integrates real election data through Google's Civic Information API
- **Conversational** — powered by Claude AI with streaming responses for a natural, interactive experience

---

## The Problem

Millions of eligible voters — especially first-time voters — lack access to clear, unbiased, and personalized information about how elections work. Existing resources are either too dense (official government sites), too partisan (news media), or too generic. This tool bridges that gap with a conversational AI interface backed by real civic data.

---

## Solution Approach

The application combines two complementary layers:

1. **Static Knowledge Layer** — A curated election knowledge base covering voter registration, voting methods, primary types, the Electoral College, and election timelines. This is injected into the AI context with prompt caching to minimize API costs.

2. **Dynamic Data Layer** — The [Google Civic Information API](https://developers.google.com/civic-information) provides real, address-specific data: upcoming election dates, polling locations, voter registration deadlines, and elected officials.

Together, these give the assistant both depth (nuanced explanations) and accuracy (live, location-aware data).

---

## How It Works

```
User types a question
        ↓
Next.js frontend sends message to POST /api/chat
        ↓
Route handler calls Google Civic Information API (if location needed)
        ↓
Enriched context + user message sent to Claude claude-opus-4-7
        ↓
Claude streams a response token-by-token
        ↓
Frontend renders tokens in real-time with streaming cursor
```

### AI Architecture

| Component | Detail |
|-----------|--------|
| Model | `claude-opus-4-7` with Adaptive Thinking |
| Streaming | `ReadableStream` via Next.js Route Handler |
| Prompt Caching | `cache_control: ephemeral` on election knowledge base |
| Context | System prompt enforces nonpartisan, factual-only responses |
| Multi-turn | Full conversation history passed on each request |

---

## Google Services Integration

| Service | Usage |
|---------|-------|
| **Google Civic Information API** | Real voter registration data, polling locations, election dates by address |
| **Google Maps JavaScript API** | Interactive map of nearby polling stations |
| **Google Fonts (Inter)** | Typography via `next/font/google` |
| **Google Calendar API** *(planned)* | Add election day reminders to user's calendar |
| **Firebase Analytics** *(planned)* | Usage analytics and performance monitoring |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS with civic color palette |
| AI | Anthropic SDK — `claude-opus-4-7` |
| Civic Data | Google Civic Information API |
| Mapping | Google Maps JavaScript API |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              ← Home: Hero + Topic Cards
│   ├── chat/page.tsx         ← Chat interface
│   ├── timeline/page.tsx     ← Election timeline
│   ├── how-to-vote/page.tsx  ← Step-by-step voting guide
│   └── api/chat/route.ts     ← Streaming AI endpoint
├── components/
│   ├── chat/                 ← ChatInterface, ChatMessage, ChatInput
│   ├── timeline/             ← ElectionTimeline
│   ├── topics/               ← TopicCards
│   └── ui/                   ← Button, Card (shared primitives)
└── lib/
    ├── anthropic.ts          ← Anthropic SDK client
    ├── google-civic.ts       ← Google Civic Information API client
    ├── election-data.ts      ← Static election data
    └── prompts.ts            ← AI system prompt + knowledge base
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)
- A [Google Cloud API key](https://console.cloud.google.com) with Civic Information API enabled

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Souhrid-Dey/election-process-education.git
cd election-process-education

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and add:
#   ANTHROPIC_API_KEY=your_key_here
#   GOOGLE_CIVIC_API_KEY=your_key_here

# 4. Start the development server
npm run dev
# → Open http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run type-check   # TypeScript validation
```

---

## Assumptions

- The primary user persona is a **first-time or infrequent voter** in the United States seeking unbiased, clear guidance on the electoral process.
- All civic data is U.S.-specific. International election systems are out of scope.
- The AI assistant is explicitly constrained from expressing any partisan opinions — this is enforced at the system prompt level and is non-negotiable.
- Real-time election data (polling locations, deadlines) requires a valid U.S. address from the user; generic questions are answered from the static knowledge base.
- The application does not store any user data, conversation history, or location information beyond the active browser session.

---

## Evaluation Criteria Compliance

| Criterion | Approach |
|-----------|----------|
| **Code Quality** | TypeScript strict mode, consistent component patterns, no dead code |
| **Security** | API keys server-side only, no user PII stored, input validation on all endpoints |
| **Efficiency** | Prompt caching on large static context, streaming to reduce perceived latency |
| **Testing** | Type-level validation via TypeScript; component-level testing planned in Phase 5 |
| **Accessibility** | WCAG 2.1 AA target, semantic HTML, keyboard navigation, ARIA labels |
| **Google Services** | Civic Information API (core feature), Maps (polling locations), Fonts, Calendar |

---

## Build Phases

See [Planning.markdown](./Planning.markdown) for the detailed phase-wise implementation plan.

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Foundation — scaffold, types, static data | ✅ Complete |
| 2 | UI Shell — navigation, home page, topic cards | ⬜ Pending |
| 3 | AI Chat — streaming Claude integration | ⬜ Pending |
| 4 | Google Integration — Civic API, Maps | ⬜ Pending |
| 5 | Rich Content — timeline, voting steps | ⬜ Pending |
| 6 | Polish & Accessibility | ⬜ Pending |
| 7 | Deploy — Vercel, env config, monitoring | ⬜ Pending |

---

## License & Usage

This project is created for the **PromptWars April 2026 Hackathon (Challenge 2)**, organized by Hack2Skill and the Google for Developers community.

- **Not intended for production or commercial use**
- **For educational and demonstration purposes only**
- All election data is sourced from publicly available Google APIs
- AI responses are generated by Claude (Anthropic) and may not be perfectly accurate — always verify with official sources (vote.gov, usa.gov)

---

<div align="center">

Built with ❤️ for PromptWars April 2026 · Challenge 2  
Organized by [Hack2Skill](https://hack2skill.com) & [Google for Developers](https://developers.google.com)

</div>
