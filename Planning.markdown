# Planning.markdown — Election Process Education

**Authoritative source of truth for the build plan.**
Read this file at the start of every session. Edit here when scope or decisions change. Do not re-derive the plan from code analysis.

---

## Project Identity

| Field | Value |
|-------|-------|
| Project Name | Election Process Education |
| Hackathon | PromptWars April 2026 — Challenge 2 |
| Organizers | Hack2Skill & Google for Developers Community |
| Format | Individual challenge, bi-weekly, India-based developers |
| Repo | https://github.com/Souhrid-Dey/election-process-education |
| Branch | `main` only (single branch — challenge rule) |
| Repo size limit | < 10 MB |
| Use | Educational only, not for production or commercial purposes |

---

## Mandatory Submission Artifacts (all 3 required)

1. **Deployed Project Link** — live app hosted on **Google Cloud Run** (not Vercel)
2. **GitHub Repository Link** — public repo with README explicitly explaining election education alignment
3. **LinkedIn Post URL** — must document: tool usage, thought process, prompt evolution, AI vs. human design; must tag @Google for Developers and @Hack2skill

---

## Evaluation Criteria

| Criterion | Weight | Notes |
|-----------|--------|-------|
| Code Quality | High | Structure, readability, maintainability |
| Security | High | No exposed keys, safe practices, no vulnerabilities |
| Efficiency | Medium | Optimal resource use — time and memory |
| Testing | Medium | Functionality can be validated and maintained |
| Accessibility | Medium | Inclusive, usable for diverse users |
| **Google Services** | **High** | Effective and meaningful integration — key differentiator |

---

## ✅ AI Backend Decision — Resolved

**Decision: Switch to Gemini API via Vertex AI.**

The Anthropic SDK scaffolding (`src/lib/anthropic.ts`) will be replaced with a Gemini client (`src/lib/gemini.ts`). The `@anthropic-ai/sdk` package will be removed from `package.json` and replaced with `@google/generative-ai` or `@google-cloud/vertexai`.

---

## GCP Setup Checklist (user action required)

- [ ] Claim GCP credits via Hack2Skill dashboard (valid 180 days)
- [ ] Create a Google Cloud project — save the **Project ID**
- [ ] Enable **Vertex AI API** in Google Cloud Console
- [ ] Generate **Gemini API key** from Vertex AI
- [ ] Enable **Civic Information API** in Google Cloud Console
- [ ] Enable **Maps JavaScript API** in Google Cloud Console
- [ ] Install **Docker Desktop** (required for Cloud Run deployment)
- [ ] Download and authenticate **Google Anti-Gravity**

---

## Deployment: Google Cloud Run

The project must be deployed to **Google Cloud Run** via the **Anti-Gravity** agent.

### Process (to be done in Phase 7)
1. Ensure `next.config.ts` has `output: "standalone"` ✅ (already set)
2. Ensure `Dockerfile` is present ✅ (already created)
3. Open Anti-Gravity, provide GCP Project ID
4. Instruct Anti-Gravity to deploy using **Command Prompt** (not PowerShell — avoids execution policy errors)
5. Anti-Gravity uses the Cloud Run MCP server to build the Docker image and deploy

### Environment variables on Cloud Run
Set these in Cloud Run console (not in code):
- `GEMINI_API_KEY` or `ANTHROPIC_API_KEY` (depending on AI decision above)
- `GOOGLE_CIVIC_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
- `NEXT_PUBLIC_APP_URL` (your Cloud Run service URL)
- `NODE_ENV=production`

---

## Core Design Principles

- **Nonpartisan always** — AI system prompt enforces strict no-partisan-opinion rule. Never weakened.
- **Server-side secrets** — All API keys server-side only. Never in client bundle or git.
- **Streaming first** — All AI responses stream token-by-token.
- **Prompt caching** — Election knowledge base always carries `cache_control: ephemeral` (if using Claude) or equivalent.
- **Google Services as a core feature** — Civic Information API is the dynamic data backbone, not an add-on.
- **Accessibility** — WCAG 2.1 AA target throughout.

---

## Architecture

### Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 App Router | Native streaming, server components, API routes |
| Language | TypeScript (strict) | Type safety across all data boundaries |
| Styling | Tailwind CSS | Rapid civic theming, no runtime CSS overhead |
| AI | **TBD — Gemini or Claude** | See open decision above |
| Civic data | Google Civic Information API | Real voter registration, polling locations, election dates |
| Mapping | Google Maps JavaScript API | Visualize polling locations by address |
| Deployment | **Google Cloud Run** (Docker) | Challenge requirement |
| Deploy tool | Google Anti-Gravity (Cloud Run MCP) | Challenge requirement |

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
    │       system: ELECTION_SYSTEM_PROMPT
    │             + ELECTION_KNOWLEDGE_BASE
    │             + civic data injected dynamically
    │       messages: conversation history
    │
    ▼
    Gemini API (Vertex AI) OR Anthropic SDK — streaming
    │
    ▼
ReadableStream → client
    │
    ▼
[Client] tokens appended in real-time with streaming cursor
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
    map/
      PollingLocationMap.tsx
    ui/
      Button.tsx
      Card.tsx
  lib/
    ai.ts                     ← Unified AI client (Gemini or Claude — TBD)
    google-civic.ts           ← Google Civic Information API client
    google-maps.ts            ← Maps helper
    election-data.ts          ← Static: TOPICS, VOTING_STEPS, TIMELINE_EVENTS
    prompts.ts                ← System prompt, knowledge base, conversation starters
  types/
    index.ts                  ← All domain types and enums
public/
  assets/
    project-banner.webp       ← Project image for README and OG
Dockerfile                    ← Multi-stage Docker build for Cloud Run
.dockerignore
```

### Google Services Integration Plan

| Service | Integration Point | Evaluation Impact |
|---------|------------------|-------------------|
| **Gemini API (Vertex AI)** | Primary AI chat backend | Direct Google AI usage — strongest signal |
| **Civic Information API** | `/api/chat` — injected into AI context per address | Core dynamic feature |
| **Maps JavaScript API** | `PollingLocationMap` component | Visual civic utility |
| **Google Fonts (Inter)** | `next/font/google` in `layout.tsx` | Performance-optimized |
| **Google Calendar API** | "Add election to Calendar" button | User utility |
| **Cloud Run** | Production deployment | Challenge requirement |

---

## Phase Plan

### Phase 1 — Foundation ✅ Complete

All types, static data, AI prompt infrastructure, stub API endpoint, Tailwind config, and component skeletons committed and pushed to GitHub.

Key decisions made:
- Next.js 15 App Router (streaming support)
- `output: "standalone"` in next.config.ts (Cloud Run compatibility)
- Dockerfile + .dockerignore created
- `.gitignore` excludes `.claude/`, `Challenge Instructions.md`, `Webinar MoM.md`

---

### Phase 2 — UI Shell ⬜ Pending

**Goal:** Polished, navigable UI with proper components. No real AI or Google APIs yet.

**Tasks:**
- [ ] Install Inter via `next/font/google`, bind to CSS variables
- [ ] Build `<Header />` with nav (Home | How to Vote | Timeline | Ask a Question)
- [ ] Build `<Footer />` with links to vote.gov, usa.gov, hackathon attribution
- [ ] Replace inline topic cards on home page with `<TopicCards />` component
- [ ] Add `/chat` page with `<ChatInterface />` layout (placeholder)
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

**Blocked by: AI backend decision (Gemini vs Claude)**

**Goal:** Real streaming chat. Prompt caching active.

**Tasks:**
- [ ] Implement `POST /api/chat` with chosen AI SDK (Gemini or Anthropic)
  - Adaptive/extended thinking enabled
  - Knowledge base cached if using Claude (`cache_control: ephemeral`)
  - Return `ReadableStream` of text chunks
- [ ] Wire `<ChatInterface />` to consume the stream
  - `useState` for messages
  - Streaming cursor while `isStreaming=true`
  - Auto-scroll to bottom
- [ ] Wire `<ChatInput />` — submit, clear, Enter key, Shift+Enter newline
- [ ] Multi-turn conversation history in request body
- [ ] Input validation + error handling
- [ ] Show `CONVERSATION_STARTERS` chips on empty state
- [ ] Pre-seed question from `?topic=<id>` URL param

**API contract:**
```
POST /api/chat
Body:   { messages: ChatMessage[], topicId?: string, address?: string }
Stream: raw text tokens (Content-Type: text/plain)
Error:  { error: string } (JSON, non-200)
```

---

### Phase 4 — Google Services Integration ⬜ Pending

**Goal:** Real civic data from Google APIs.

**Tasks:**
- [ ] Create `src/lib/google-civic.ts`
  - `getVoterInfo(address)` → registration deadlines, polling locations
  - `getRepresentatives(address)` → elected officials
  - `getElections()` → upcoming elections list
- [ ] Inject Civic API data into chat context when address is provided
- [ ] Add address input to chat UI ("Enter your address for personalized info")
- [ ] Build `<PollingLocationMap />` (Google Maps JS API)
  - Nearest polling locations as map markers
  - Address search + recenter
- [ ] "Add to Calendar" button for election dates (Google Calendar API)
- [ ] Security: all server-side keys restricted; Maps client key domain-restricted

**New files:**
- `src/lib/google-civic.ts`
- `src/lib/google-maps.ts`
- `src/components/map/PollingLocationMap.tsx`

---

### Phase 5 — Rich Content ⬜ Pending

**Goal:** Timeline, voting steps walkthrough, richer topic exploration.

**Tasks:**
- [ ] Full `<ElectionTimeline />` with today-marker and color-coded event types
- [ ] `/timeline` page — full presidential-cycle timeline
- [ ] `<VotingSteps />` walkthrough using `VOTING_STEPS` data
- [ ] `/how-to-vote` page — step-by-step voting guide
- [ ] Link timeline events to chat with pre-seeded questions
- [ ] State-specific voter registration lookup via vote.gov

**New files:**
- `src/app/timeline/page.tsx`
- `src/app/how-to-vote/page.tsx`
- `src/components/voting/VotingSteps.tsx`

---

### Phase 6 — Polish & Accessibility ⬜ Pending

**Goal:** Production-quality UX, full WCAG 2.1 AA, and testing.

**Tasks:**
- [ ] WCAG 2.1 AA audit — keyboard nav, ARIA labels, color contrast ≥ 4.5:1
- [ ] Animate topic cards (staggered fade-up)
- [ ] Animate chat messages (slide in)
- [ ] "Copy to clipboard" on assistant messages
- [ ] Loading skeletons for chat
- [ ] `<ErrorBoundary />` around `<ChatInterface />`
- [ ] Component tests for `ChatMessage`, `TopicCards`, `ElectionTimeline`
- [ ] API route tests (mock AI + Google APIs)
- [ ] `robots.txt`, `sitemap.xml`
- [ ] OpenGraph image (`og:image` → `public/assets/project-banner.webp`)
- [ ] Mobile UX pass — hamburger menu, touch targets

---

### Phase 7 — Deploy to Google Cloud Run ⬜ Pending

**Goal:** Live deployment via Anti-Gravity agent.

**Tasks:**
- [ ] Verify `npm run build` passes locally with `output: "standalone"`
- [ ] Test Docker build locally: `docker build -t election-education .`
- [ ] Test Docker run locally: `docker run -p 8080:8080 --env-file .env.local election-education`
- [ ] Open Anti-Gravity, authenticate with GCP
- [ ] Provide GCP Project ID to Anti-Gravity agent
- [ ] Instruct Anti-Gravity to deploy via **Command Prompt** (not PowerShell)
- [ ] Set all environment variables in Cloud Run console
- [ ] Verify streaming works on Cloud Run (Node.js runtime)
- [ ] Confirm repo size < 10 MB
- [ ] Confirm single `main` branch
- [ ] Get deployed Cloud Run URL
- [ ] Update `NEXT_PUBLIC_APP_URL` in Cloud Run env vars
- [ ] Write LinkedIn post — tag @Google for Developers and @Hack2skill
- [ ] Submit: deployed link + GitHub link + LinkedIn post URL

---

## Environment Variables

```bash
# .env.local (never committed)

# AI — use Gemini OR Anthropic (pending decision)
GEMINI_API_KEY=              # Vertex AI — Google Cloud Console
ANTHROPIC_API_KEY=           # Anthropic Console (if using Claude)
ANTHROPIC_MODEL=claude-opus-4-7

# Google Services
GOOGLE_CIVIC_API_KEY=        # Server-side only
GOOGLE_MAPS_API_KEY=         # Server-side only
NEXT_PUBLIC_GOOGLE_MAPS_KEY= # Client-safe, domain-restricted

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-05-02 | Next.js 15 App Router | Native streaming support |
| 2026-05-02 | `output: "standalone"` in next.config.ts | Required for Docker/Cloud Run |
| 2026-05-02 | Google Cloud Run (not Vercel) | Challenge requirement — confirmed from webinar |
| 2026-05-02 | Anti-Gravity for deployment | Challenge requirement |
| 2026-05-02 | All API keys server-side only | Security criterion |
| 2026-05-02 | Single `main` branch | Challenge requirement |
| 2026-05-02 | Gitignore: .claude/, Challenge Instructions.md, Webinar MoM.md | Don't expose internal files |
| 2026-05-02 | AI backend: **Gemini via Vertex AI** | Challenge requires Gemini key; strongest Google Services signal |
| 2026-05-02 | `GEMINI_HANDOFF_PROMPT.md` created and gitignored | AI context handoff doc — internal only |
