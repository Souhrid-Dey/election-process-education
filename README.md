<div align="center">

![Election Process Education](public/assets/project-banner.webp)

# Election Process Education

### An AI-Powered Civic Assistant for Understanding U.S. Elections

[![Hackathon](https://img.shields.io/badge/Hackathon-PromptWars%20April%202026-blue?style=flat-square)](https://hack2skill.com)
[![Challenge](https://img.shields.io/badge/Challenge-2%20%7C%20Election%20Process%20Education-orange?style=flat-square)]()
[![Organizers](https://img.shields.io/badge/Organized%20by-Hack2Skill%20%26%20Google%20for%20Developers-4285F4?style=flat-square&logo=google)](https://developers.google.com)
[![Deploy](https://img.shields.io/badge/Deployed%20on-Google%20Cloud%20Run-4285F4?style=flat-square&logo=googlecloud)](https://cloud.google.com/run)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square)]()
[![License](https://img.shields.io/badge/Use-Educational%20Only-green?style=flat-square)]()

</div>

---

> **Disclaimer:** This project is developed as part of the **PromptWars April 2026 — Challenge 2**, organized by [Hack2Skill](https://hack2skill.com) and the [Google for Developers](https://developers.google.com) community. It is **not intended for production or commercial use** and is provided solely for **educational and demonstration purposes**.

---

## Problem Statement Alignment

**Challenge 2** asks developers to build a solution that explains the **civic election process to laymen in an interactive and digestible way**.

This application addresses that directly by:
- Providing a **conversational AI assistant** that answers any question about U.S. elections in plain, accessible language
- Integrating **real civic data** (polling locations, registration deadlines, election dates) via Google's Civic Information API — personalized to the user's address
- Presenting **visual tools** — an election timeline, step-by-step voting guide, and interactive polling location maps
- Maintaining a strict **nonpartisan stance** — the AI never expresses opinions on candidates, parties, or policies

---

## Overview

Millions of eligible voters — especially first-time voters — lack access to clear, unbiased, and personalized information about how elections work. Existing resources are either too dense (official government sites), too partisan (news media), or too generic.

**Election Process Education** bridges this gap with a streaming AI interface, backed by live Google civic data, that explains everything from voter registration deadlines to how the Electoral College works — conversationally, clearly, and without political bias.

---

## How It Works

```
User types a question
        ↓
Next.js frontend → POST /api/chat
        ↓
Route handler calls Google Civic Information API (if address provided)
  → registration deadlines, polling locations, election dates
        ↓
Enriched context + conversation history → AI model (streaming)
        ↓
Tokens streamed token-by-token to the browser
        ↓
Real-time response displayed with streaming cursor
```

### AI Architecture

| Component | Detail |
|-----------|--------|
| Model | Gemini (Vertex AI) via Google Cloud |
| Streaming | `ReadableStream` via Next.js Route Handler |
| Context | Nonpartisan system prompt + election knowledge base |
| Civic data | Google Civic Information API (address-specific) |
| Multi-turn | Full conversation history passed each request |

---

## Google Services Integration

| Service | Integration |
|---------|-------------|
| **Gemini API (Vertex AI)** | Primary AI model — conversational civic assistant |
| **Google Civic Information API** | Real voter registration data, polling locations, election dates by address |
| **Google Maps JavaScript API** | Interactive map of nearby polling stations |
| **Google Fonts (Inter)** | Performance-optimized typography via `next/font/google` |
| **Google Calendar API** | "Add election day to Calendar" for upcoming election dates |
| **Google Cloud Run** | Production hosting and deployment |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS with civic color palette |
| AI | Gemini API via Google Vertex AI |
| Civic Data | Google Civic Information API |
| Mapping | Google Maps JavaScript API |
| Containerization | Docker (multi-stage build) |
| Deployment | Google Cloud Run |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              ← Home: Hero + Topic Cards
│   ├── chat/page.tsx         ← Chat interface
│   ├── timeline/page.tsx     ← Election timeline
│   ├── how-to-vote/page.tsx  ← Step-by-step voting guide
│   └── api/chat/route.ts     ← Streaming AI + Civic API endpoint
├── components/
│   ├── chat/                 ← ChatInterface, ChatMessage, ChatInput
│   ├── map/                  ← PollingLocationMap
│   ├── timeline/             ← ElectionTimeline
│   ├── topics/               ← TopicCards
│   ├── voting/               ← VotingSteps
│   └── ui/                   ← Button, Card (shared primitives)
└── lib/
    ├── ai.ts                 ← AI client (Gemini via Vertex AI)
    ├── google-civic.ts       ← Google Civic Information API client
    ├── google-maps.ts        ← Maps helper
    ├── election-data.ts      ← Static election data
    └── prompts.ts            ← System prompt + knowledge base
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop (for local Cloud Run simulation)
- A Google Cloud project with billing enabled
- APIs enabled: Vertex AI, Civic Information API, Maps JavaScript API

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Souhrid-Dey/election-process-education.git
cd election-process-education

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local — add your API keys

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

### Docker (local Cloud Run simulation)

```bash
docker build -t election-education .
docker run -p 8080:8080 --env-file .env.local election-education
# → Open http://localhost:8080
```

---

## Assumptions

- The primary user persona is a **first-time or infrequent voter** in the United States seeking unbiased, clear guidance on the electoral process.
- All civic data is U.S.-specific. International election systems are out of scope.
- The AI assistant is explicitly constrained from expressing any partisan opinions — enforced at the system prompt level.
- Real-time civic data (polling locations, deadlines) requires a valid U.S. address; generic questions are answered from the static knowledge base.
- The application does not store any user data, conversation history, or location information beyond the active browser session.

---

## Evaluation Criteria

| Criterion | Approach |
|-----------|----------|
| **Code Quality** | TypeScript strict mode, consistent patterns, no dead code |
| **Security** | All API keys server-side only, no PII stored, input validation on all endpoints |
| **Efficiency** | Knowledge base context cached, streaming to reduce perceived latency |
| **Testing** | Type-level validation (TypeScript); component and API route tests in Phase 6 |
| **Accessibility** | WCAG 2.1 AA target, semantic HTML, keyboard navigation, ARIA labels |
| **Google Services** | Gemini AI (core), Civic Information API (data backbone), Maps, Calendar, Cloud Run |

---

## Build Phases

See [Planning.markdown](./Planning.markdown) for the complete phase-wise plan.

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Foundation — scaffold, types, static data, Docker | ✅ Complete |
| 2 | UI Shell — navigation, home page, topic cards | ✅ Complete |
| 3 | AI Chat — streaming Gemini integration | ✅ Complete |
| 4 | Google Integration — Civic API, Maps, Calendar | ✅ Complete |
| 5 | Rich Content — timeline, voting steps | ⬜ Pending |
| 6 | Polish & Accessibility | ⬜ Pending |
| 7 | Deploy — Google Cloud Run via Anti-Gravity | ⬜ Pending |

---

## License & Usage

This project is created for the **PromptWars April 2026 Hackathon (Challenge 2)**, organized by Hack2Skill and the Google for Developers community.

- **Not intended for production or commercial use**
- **For educational and demonstration purposes only**
- All election data sourced from publicly available Google APIs
- AI responses generated by Google Gemini — always verify with official sources (vote.gov, usa.gov)

---

<div align="center">

Built for PromptWars April 2026 · Challenge 2 — Election Process Education  
Organized by [Hack2Skill](https://hack2skill.com) & [Google for Developers](https://developers.google.com)

</div>
