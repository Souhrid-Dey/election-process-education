# Planning.markdown — Election Process Education

**Authoritative source of truth for the build plan.**
Edit this file to update scope, phase status, or architectural decisions. Do not derive the plan from code analysis — read this file first.

---

## Project Identity

| Field | Value |
|-------|-------|
| Project Name | Election Process Education |
| Hackathon | PromptWars April 2026 — Challenge 2 |
| Organizers | Hack2Skill & Google for Developers Community |
| Repo | https://github.com/Souhrid-Dey/election-process-education |
| Branch | `main` (single branch — challenge requirement) |
| Repo size limit | < 10 MB |
| Use | Educational only, not production/commercial |

---

## Evaluation Criteria (from Challenge Instructions)

Submissions are scored on:
1. **Code Quality** — structure, readability, maintainability
2. **Security** — safe practices, no exposed keys, no vulnerabilities
3. **Efficiency** — optimal use of time and memory
4. **Testing** — functionality can be validated and maintained
5. **Accessibility** — inclusive, usable design for diverse users
6. **Google Services** — effective and meaningful integration ← *key differentiator*

---

## Core Design Principles

- **Nonpartisan always** — The AI system prompt enforces a strict no-partisan-opinion rule. This is never weakened, regardless of user input.
- **Server-side secrets** — All API keys (Anthropic, Google) live server-side only. Never exposed to the client bundle.
- **Streaming first** — All AI responses stream token-by-token. No buffering.
- **Prompt caching** — The large election knowledge base always carries `cache_control: ephemeral` to minimize Anthropic API costs.
- **Google Services as a core feature** — Not bolted on. Google Civic Information API is the dynamic data backbone.
- **Accessibility** — WCAG 2.1 AA target throughout. Not an afterthought.

---

## Architecture

### Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 App Router | Native streaming, server components, API routes |
| Language | TypeScript (strict) | Type safety across all data boundaries |
| Styling | Tailwind CSS | Rapid civic theming, no runtime CSS overhead |
| AI | Anthropic SDK — `claude-opus-4-7` | Most capable; adaptive thinking for complex civic questions |
| Civic data | Google Civic Information API | Real voter registration, polling locations, election dates |
| Mapping | Google Maps JavaScript API | Visualize polling locations by address |
| Deployment | Vercel | Native Next.js support, edge streaming |

### Data Flow

```
User question
    │
    ▼
[Client] ChatInterface
    │  POST /api/chat  { messages[], address? }
    ▼
[Server] /api/chat route handler
    │
    ├─► Google Civic Information API  (if address provided)
    │       → election dates, polling locations, registration deadlines
    │
    ├─► Build prompt:
    │       system: ELECTION_SYSTEM_PROMPT (cache_control: ephemeral)
    │             + ELECTION_KNOWLEDGE_BASE (cache_control: ephemeral)
    │             + civic data from Google API (injected dynamically)
    │       messages: conversation history
    │
    ▼
    Anthropic SDK  (claude-opus-4-7, adaptive thinking, streaming)
    │
    ▼
ReadableStream → client
    │
    ▼
[Client] tokens appended to streaming message bubble
```

### File Structure

```
src/
  app/
    page.tsx                  ← Home (Hero + TopicCards)
    layout.tsx                ← Root layout (Header, Footer)
    chat/page.tsx             ← Dedicated chat page
    timeline/page.tsx         ← Election timeline
    how-to-vote/page.tsx      ← Step-by-step voting guide
    api/
      chat/route.ts           ← POST /api/chat — streaming AI + Civic API
  components/
    layout/
      Header.tsx
      Footer.tsx
    chat/
      ChatInterface.tsx
      ChatMessage.tsx
      ChatInput.tsx
    timeline/
      ElectionTimeline.tsx
    topics/
      TopicCards.tsx
    voting/
      VotingSteps.tsx
    ui/
      Button.tsx
      Card.tsx
  lib/
    anthropic.ts              ← SDK client, MODEL, MAX_TOKENS
    google-civic.ts           ← Google Civic Information API client
    google-maps.ts            ← Maps helper (polling location rendering)
    election-data.ts          ← Static: TOPICS, VOTING_STEPS, TIMELINE_EVENTS
    prompts.ts                ← ELECTION_SYSTEM_PROMPT, ELECTION_KNOWLEDGE_BASE, CONVERSATION_STARTERS
  types/
    index.ts                  ← All domain types and enums
public/
  assets/
    project-banner.webp       ← Project image for README and OG
```

### Google Services Integration Plan

| Service | Integration Point | Why It Matters for Evaluation |
|---------|------------------|-------------------------------|
| **Civic Information API** | `/api/chat` route handler — injected into AI context when user provides address | Core dynamic feature — makes answers real and location-specific |
| **Maps JavaScript API** | `PollingLocationMap` component on chat and timeline pages | Visual, practical civic tool |
| **Google Fonts (Inter)** | `next/font/google` in `layout.tsx` | Performance-optimized font loading |
| **Google Calendar API** | "Add to Calendar" button for election dates | User utility, demonstrates breadth of Google integration |
| **Firebase Analytics** *(optional)* | App-level tracking for usage patterns | Monitoring and evaluation support |

---

## Phase Plan

### Phase 1 — Foundation ✅ Complete

**Goal:** Runnable skeleton with all types, static data, and stub endpoints defined.

**Deliverables — all done:**
- `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- `.env.example`, `.gitignore` (with `.claude/` and `Challenge Instructions.md` excluded)
- `src/types/index.ts` — all domain types and enums
- `src/lib/election-data.ts` — `TOPICS`, `VOTING_STEPS`, `SAMPLE_TIMELINE_EVENTS`
- `src/lib/prompts.ts` — system prompt, knowledge base, conversation starters
- `src/lib/anthropic.ts` — SDK client
- `src/app/api/chat/route.ts` — stub POST endpoint
- `src/app/globals.css`, `layout.tsx`, `page.tsx`
- All component skeletons: `ChatInterface`, `ChatMessage`, `ChatInput`, `ElectionTimeline`, `TopicCards`, `Button`, `Card`
- `CLAUDE.md`, `README.md`, `Planning.markdown`, `Instruction.md`
- Git initialized, connected to GitHub, pushed

---

### Phase 2 — UI Shell ⬜ Pending

**Goal:** Polished, navigable UI. No real AI or Google APIs yet.

**Tasks:**
- [ ] Install Inter via `next/font/google`, bind to CSS variables
- [ ] Build `<Header />` with nav (Home | How to Vote | Timeline | Ask a Question)
- [ ] Build `<Footer />` with links to vote.gov, usa.gov, and hackathon attribution
- [ ] Replace inline topic cards on home page with `<TopicCards />` component
- [ ] Add `/chat` page with `<ChatInterface />` layout (no real calls yet)
- [ ] Wire topic card clicks → `/chat?topic=<id>`
- [ ] Add "How It Works" 3-step section on home page
- [ ] Add accessibility skip-to-content link
- [ ] Complete `<Button />` variants (primary, secondary, ghost, loading state)
- [ ] Mobile responsiveness pass

**New files:**
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/chat/page.tsx`

---

### Phase 3 — AI Chat (Streaming) ⬜ Pending

**Goal:** Real streaming chat with Claude. Prompt caching active.

**Tasks:**
- [ ] Implement `POST /api/chat` with Anthropic SDK
  - `claude-opus-4-7` + `thinking: { type: "adaptive" }`
  - `cache_control: ephemeral` on system prompt + knowledge base
  - Return `ReadableStream` of text chunks
- [ ] Wire `<ChatInterface />` to consume the stream
  - `useState` for messages array
  - Streaming cursor while `isStreaming=true`
  - Auto-scroll to bottom on new tokens
- [ ] Wire `<ChatInput />` — submit, clear, Enter key, Shift+Enter newline
- [ ] Multi-turn conversation history in request body
- [ ] Input validation (empty, too long)
- [ ] Error handling (API key missing, rate limit, network failure)
- [ ] Show `CONVERSATION_STARTERS` chips on empty chat state
- [ ] Pre-seed question from `?topic=<id>` URL param

**API contract:**
```
POST /api/chat
Body:   { messages: ChatMessage[], topicId?: string, address?: string }
Stream: raw text tokens (Content-Type: text/plain)
Error:  { error: string } (JSON, non-200)
```

**Prompt structure:**
```
system[0]: ELECTION_SYSTEM_PROMPT        { cache_control: ephemeral }
system[1]: ELECTION_KNOWLEDGE_BASE       { cache_control: ephemeral }
system[2]: civic_api_context (dynamic)   { no cache — varies per request }
messages:  conversation history
```

---

### Phase 4 — Google Services Integration ⬜ Pending

**Goal:** Make the assistant data-driven with real civic information.

**Tasks:**
- [ ] Create `src/lib/google-civic.ts`
  - `getVoterInfo(address)` → registration deadlines, polling locations, ballot info
  - `getRepresentatives(address)` → elected officials at all levels
  - `getElections()` → upcoming elections list
  - Typed responses matching domain types in `src/types/index.ts`
- [ ] Inject Civic API response into chat context when address is present
- [ ] Add address input to chat UI ("Enter your address for personalized info")
- [ ] Build `<PollingLocationMap />` component (Google Maps JS API)
  - Show nearest polling locations as map markers
  - Address search + recenter
- [ ] Add "Add to Calendar" button for election dates (Google Calendar API)
  - Create event via Calendar API with polling location and registration deadline
- [ ] Add Google Fonts (Inter) via `next/font/google`
- [ ] Security: all Google API keys server-side; Maps client key restricted to domain

**New files:**
- `src/lib/google-civic.ts`
- `src/lib/google-maps.ts`
- `src/components/map/PollingLocationMap.tsx`

---

### Phase 5 — Rich Content ⬜ Pending

**Goal:** Election timeline, voting steps guide, and richer topic exploration.

**Tasks:**
- [ ] Build full `<ElectionTimeline />` with today-marker and color-coded event types
- [ ] Add `/timeline` page — full presidential-cycle timeline
- [ ] Build `<VotingSteps />` walkthrough using `VOTING_STEPS` data
- [ ] Add `/how-to-vote` page — step-by-step voting guide
- [ ] Link timeline events to chat with pre-seeded questions
- [ ] State-specific voter registration lookup (external link to vote.gov)

**New files:**
- `src/app/timeline/page.tsx`
- `src/app/how-to-vote/page.tsx`
- `src/components/voting/VotingSteps.tsx`

---

### Phase 6 — Polish & Accessibility ⬜ Pending

**Goal:** Production-quality UX, full accessibility, and testing.

**Tasks:**
- [ ] WCAG 2.1 AA audit — keyboard navigation, ARIA labels, color contrast ≥ 4.5:1
- [ ] Animate topic cards (staggered fade-up on mount)
- [ ] Animate chat messages (slide in from bottom)
- [ ] "Copy to clipboard" on assistant messages
- [ ] Loading skeleton for chat interface
- [ ] `<ErrorBoundary />` around `<ChatInterface />`
- [ ] Component tests for `ChatMessage`, `TopicCards`, `ElectionTimeline`
- [ ] API route tests for `/api/chat` (mock Anthropic + Google APIs)
- [ ] `robots.txt`, `sitemap.xml`
- [ ] OpenGraph image (`og:image` → `public/assets/project-banner.webp`)
- [ ] Mobile UX pass — hamburger menu, touch targets

---

### Phase 7 — Deploy ⬜ Pending

**Goal:** Live public deployment on Vercel.

**Tasks:**
- [ ] Create Vercel project, link GitHub repo
- [ ] Set environment variables: `ANTHROPIC_API_KEY`, `GOOGLE_CIVIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_APP_URL`
- [ ] Restrict Google Maps client key to Vercel domain
- [ ] Test streaming on Vercel (Node.js runtime — not Edge, for SDK compatibility)
- [ ] Verify < 10 MB repo size
- [ ] Add rate limiting on `/api/chat` (Vercel KV or in-memory for hackathon)
- [ ] Final `npm run build` + type-check pass
- [ ] Verify single `main` branch (challenge requirement)

---

## Environment Variables

```bash
# .env.local (never committed)
ANTHROPIC_API_KEY=           # Anthropic console — server-side only
ANTHROPIC_MODEL=claude-opus-4-7   # optional override
GOOGLE_CIVIC_API_KEY=        # Google Cloud Console — server-side only
GOOGLE_MAPS_API_KEY=         # Google Cloud Console — server-side only
NEXT_PUBLIC_GOOGLE_MAPS_KEY= # Restricted Maps key — safe to expose to client
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Open Questions (to resolve before Phase 2)

- [ ] Which specific Google Services are required vs. optional for Challenge 2?
- [ ] Is there a defined **persona** for Challenge 2 (e.g., first-time voter, election official)?
- [ ] What is **Antigravity** (mentioned in challenge instructions)? Any constraints from it?
- [ ] Should the app support any U.S. state specifically, or nationwide?
- [ ] Is Firebase Analytics required, or is any Google Service sufficient?

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-05-02 | Next.js App Router over Pages Router | Native streaming support |
| 2026-05-02 | `claude-opus-4-7` + adaptive thinking | Most capable model; complex civic reasoning |
| 2026-05-02 | Google Civic Information API as core feature | Satisfies "Google Services" criterion meaningfully |
| 2026-05-02 | All API keys server-side only | Security criterion; never expose in client bundle |
| 2026-05-02 | Single `main` branch | Challenge requirement |
| 2026-05-02 | `.claude/` and `Challenge Instructions.md` gitignored | User instruction — don't expose internal Claude/hackathon files |
