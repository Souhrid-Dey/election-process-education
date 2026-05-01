/**
 * POST /api/chat
 *
 * Streaming chat endpoint powered by Claude AI.
 * Returns a ReadableStream so the UI can display tokens as they arrive.
 *
 * TODO Phase 3:
 *  [ ] Implement streaming response via Anthropic SDK
 *  [ ] Add prompt caching for ELECTION_KNOWLEDGE_BASE
 *  [ ] Add conversation history handling (multi-turn)
 *  [ ] Add input validation & rate limiting
 *  [ ] Add error handling (API key missing, quota exceeded, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import type { ChatApiRequest, ChatApiError } from "@/types";

export async function POST(req: NextRequest): Promise<Response> {
  // TODO Phase 3: Remove this stub and implement real streaming
  const body = (await req.json()) as ChatApiRequest;

  if (!body.messages || body.messages.length === 0) {
    return NextResponse.json<ChatApiError>(
      { error: "No messages provided" },
      { status: 400 }
    );
  }

  // Stub response — replace with Anthropic streaming in Phase 3
  return NextResponse.json({
    message:
      "🚧 Chat API is not yet implemented. See src/app/api/chat/route.ts for Phase 3 TODO items.",
  });
}
