/**
 * Anthropic SDK client initialisation.
 * Phase 3 will wire this into the streaming API route.
 *
 * Model: claude-opus-4-7 (most capable, adaptive thinking)
 * Features used:
 *  - Streaming (long responses)
 *  - Prompt caching (shared election knowledge base)
 */

import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error(
    "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key."
  );
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-7";

export const MAX_TOKENS = 2048;

// TODO Phase 3: Implement streaming chat with prompt caching
// Reference: src/app/api/chat/route.ts
