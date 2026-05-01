# Instruction.md — Election Process Education: Full Build Plan

An AI-powered civic education assistant that helps users understand U.S. elections — voter registration, timelines, the Electoral College, and more — through streaming, nonpartisan AI chat.

---

## Phase Overview

| Phase | Name                | Status      | Goal |
|-------|---------------------|-------------|------|
| 1     | Foundation          | ✅ Complete | Project scaffold, types, static data, stub API |
| 2     | UI Shell            | ⬜ Pending  | Polished home page, navigation, topic cards |
| 3     | AI Chat             | ⬜ Pending  | Streaming chat with Claude, prompt caching |
| 4     | Rich Content        | ⬜ Pending  | Election timeline, voting steps walkthrough |
| 5     | Polish & UX         | ⬜ Pending  | Accessibility, animations, mobile |
| 6     | Deploy              | ⬜ Pending  | Vercel deployment, env config, monitoring |

---

## Phase 1 — Foundation ✅

**Goal:** Runnable skeleton with all types, static data, and stub endpoints defined.

### Deliverables
- [x] `package.json` — Next.js 15, React 18, Tailwind 3, `@anthropic-ai/sdk ^0.52.0`
- [x] `tsconfig.json` — strict mode, `@/*` → `./src/*` path alias
- [x] `tailwind.config.ts` — civic color palette (navy #1B3A6B, red #B22234, gold #D4AF37)
- [x] `.env.example` — `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `NEXT_PUBLIC_APP_URL`
- [x] `src/types/index.ts` — all domain types and enums
- [x] `src/lib/election-data.ts` — `TOPICS`, `VOTING_STEPS`, `SAMPLE_TIMELINE_EVENTS`
- [x] `src/lib/prompts.ts` — system prompt, knowledge base, conversation starters
- [x] `src/lib/anthropic.ts` — SDK client + `MODEL` + `MAX_TOKENS`
- [x] `src/app/api/chat/route.ts` — stub POST endpoint
- [x] `src/app/globals.css` — Tailwind directives, `civic-gradient`, `streaming-cursor`
- [x] `src/app/layout.tsx` — root layout with `Metadata`
- [x] `src/app/page.tsx` — home page (Hero + inline topic cards)
- [x] Component skeletons: `ChatInterface`, `ChatMessage`, `ChatInput`, `ElectionTimeline`, `TopicCards`, `Button`, `Card`

---

## Phase 2 — UI Shell ⬜

**Goal:** Polished, navigable UI with proper components. No real AI yet.

### Tasks
- [ ] Install Google Font (Inter) via `next/font` and bind to CSS variables
- [ ] Build `<Header />` component with nav links (Home, About, Timeline)
- [ ] Build `<Footer />` component with resource links (vote.gov, usa.gov)
- [ ] Replace inline topic card grid on home page with `<TopicCards />` component
- [ ] Add `/chat` page with `<ChatInterface />` placeholder
- [ ] Wire topic card clicks → `/chat?topic=<id>` URL
- [ ] Add "How It Works" 3-step section on home page
- [ ] Add accessibility skip-to-content link
- [ ] Add `<Button />` variant styles (primary, secondary, ghost)
- [ ] Mobile responsiveness pass across all pages

### Files to create/modify
- `src/components/layout/Header.tsx` (new)
- `src/components/layout/Footer.tsx` (new)
- `src/app/chat/page.tsx` (new)
- `src/app/layout.tsx` (add Header + Footer)
- `src/app/page.tsx` (use `<TopicCards />`, add How It Works)
- `src/app/globals.css` (Google Font binding)

---

## Phase 3 — AI Chat ⬜

**Goal:** Real streaming chat powered by Claude with prompt caching.

### Tasks
- [ ] Implement `POST /api/chat` with Anthropic SDK streaming
  - Use `claude-opus-4-7` with `thinking: { type: "adaptive" }`
  - Attach `cache_control: { type: "ephemeral" }` to `ELECTION_KNOWLEDGE_BASE`
  - Return `ReadableStream` with token-by-token text chunks
- [ ] Wire `<ChatInterface />` to consume the stream
  - `useState` for messages array
  - Append tokens to the last message while `isStreaming=true`
  - Auto-scroll to bottom on new tokens
- [ ] Wire `<ChatInput />` to submit messages and clear on send
- [ ] Handle multi-turn conversation history in request body
- [ ] Add input validation (empty message, too long)
- [ ] Add error handling (API key missing, rate limit, network)
- [ ] Show CONVERSATION_STARTERS as clickable chips on empty state
- [ ] Pre-seed question from `?topic=<id>` URL param

### API contract
```
POST /api/chat
Body: { messages: ChatMessage[], topicId?: string }
Response: ReadableStream (text/event-stream)
  → Each chunk: raw token text
  → On error: JSON { error: string }
```

### Prompt caching strategy
```
[tools]           ← no caching (deterministic, small)
[system]          ← ELECTION_SYSTEM_PROMPT (cache_control: ephemeral) + ELECTION_KNOWLEDGE_BASE (cache_control: ephemeral)
[messages]        ← conversation history (no caching — varies per user)
```

---

## Phase 4 — Rich Content ⬜

**Goal:** Add timeline, voting steps walkthrough, and richer topic exploration.

### Tasks
- [ ] Build `<ElectionTimeline />` with real data and today-marker
- [ ] Add `/timeline` page with full presidential-cycle timeline
- [ ] Build "Voting Steps" walkthrough component using `VOTING_STEPS`
- [ ] Add a `/how-to-vote` page with step-by-step guide
- [ ] Link timeline events to chat with pre-seeded questions
- [ ] Add state-specific voter registration lookup (external link to vote.gov)

### Files to create
- `src/app/timeline/page.tsx`
- `src/app/how-to-vote/page.tsx`
- `src/components/voting/VotingSteps.tsx`

---

## Phase 5 — Polish & UX ⬜

**Goal:** Production-quality UX, accessibility, and performance.

### Tasks
- [ ] WCAG 2.1 AA audit — keyboard navigation, ARIA labels, color contrast
- [ ] Animate topic card grid (staggered fade-up on mount)
- [ ] Animate chat messages (slide in from bottom)
- [ ] Add "Copy to clipboard" on assistant messages
- [ ] Add thumbs up/down feedback on assistant messages (client-side only)
- [ ] Loading skeleton for chat interface
- [ ] `<ErrorBoundary />` around `<ChatInterface />`
- [ ] `robots.txt`, `sitemap.xml`
- [ ] Add `og:image` for social sharing

---

## Phase 6 — Deploy ⬜

**Goal:** Live public deployment on Vercel.

### Tasks
- [ ] Create Vercel project and link GitHub repo
- [ ] Add `ANTHROPIC_API_KEY` in Vercel environment variables
- [ ] Verify `NEXT_PUBLIC_APP_URL` is set for production
- [ ] Run `npm run build` locally and fix any type/lint errors
- [ ] Test streaming on Vercel deployment (Edge vs Node runtime)
- [ ] Add rate limiting on `/api/chat` (Upstash or Vercel KV)
- [ ] Set up Vercel Analytics
- [ ] Custom domain (optional)

---

## Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | Next.js 15 App Router | Native streaming support for AI responses |
| AI model | `claude-opus-4-7` | Most capable; adaptive thinking for complex civic questions |
| Streaming | `ReadableStream` via route handler | Token-by-token display, no buffering |
| Prompt caching | Ephemeral on knowledge base | Large stable block; 5-min TTL cuts costs significantly |
| Styling | Tailwind CSS | Rapid civic theming; no runtime CSS |
| State | React `useState` (client) | Simple enough; no global store needed for Phase 3 |

---

## Data Model Summary

```
Topic           — id, title, description, icon, color, suggestedQuestions[]
ElectionEvent   — id, title, date, description, type, phase
VotingStep      — id, title, description, icon, details, links?
ChatMessage     — id, role, content, timestamp, isStreaming?
```

---

## Nonpartisan Rule

The AI assistant must **never** express opinions on candidates, parties, policies, or partisan issues. If a question touches politics, the assistant redirects to factual process information. This constraint is enforced in `ELECTION_SYSTEM_PROMPT` in `src/lib/prompts.ts` and must never be removed or weakened.
