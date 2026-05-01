# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies (first time)
npm run dev          # start dev server on http://localhost:3000 (Turbopack)
npm run build        # production build
npm run type-check   # TypeScript check without emitting
```

Copy `.env.example` to `.env.local` and add `ANTHROPIC_API_KEY` before running.

## Architecture

**Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS · Anthropic SDK

```
src/
  app/
    page.tsx              ← Home page (Hero + TopicCards)
    layout.tsx            ← Root layout (Header/Footer stubs)
    globals.css           ← Tailwind base + civic-gradient + streaming-cursor
    api/chat/route.ts     ← POST /api/chat — streaming chat endpoint (Phase 3)
  components/
    chat/                 ← ChatInterface, ChatMessage, ChatInput
    timeline/             ← ElectionTimeline
    topics/               ← TopicCards
    ui/                   ← Button, Card (shared primitives)
  lib/
    anthropic.ts          ← Anthropic SDK client + MODEL constant
    election-data.ts      ← Static data: TOPICS, VOTING_STEPS, SAMPLE_TIMELINE_EVENTS
    prompts.ts            ← ELECTION_SYSTEM_PROMPT, ELECTION_KNOWLEDGE_BASE (cacheable), CONVERSATION_STARTERS
  types/
    index.ts              ← All shared TypeScript types and enums
```

## Key Patterns

**Streaming chat:** `POST /api/chat` returns a `ReadableStream`. The client reads it token-by-token and appends to a streaming message bubble. Use the `streaming-cursor` CSS class while streaming is in progress.

**Prompt caching:** `ELECTION_KNOWLEDGE_BASE` in `src/lib/prompts.ts` is large and stable — always attach `cache_control: { type: "ephemeral" }` to it to keep Anthropic API costs low.

**Static data → AI context:** `election-data.ts` exports typed data consumed by both the UI (topic cards, timeline) and injected into the AI system prompt.

**Nonpartisan constraint:** The system prompt in `prompts.ts` enforces a strict no-partisan-opinion rule. Never weaken this in any phase.

**Model:** Always `claude-opus-4-7` with `thinking: { type: "adaptive" }` for the chat endpoint. The `MODEL` constant in `anthropic.ts` can be overridden via `ANTHROPIC_MODEL` env var.

## Phase Status

See `Instruction.md` for the full phase-wise build plan and completion status.
