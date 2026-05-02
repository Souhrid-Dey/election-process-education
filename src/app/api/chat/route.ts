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
import { getGeminiModel } from "@/lib/gemini";
import { ELECTION_SYSTEM_PROMPT, ELECTION_KNOWLEDGE_BASE } from "@/lib/prompts";
import { getVoterInfo, formatCivicDataForPrompt } from "@/lib/google-civic";
import type { ChatApiRequest, ChatApiError } from "@/types";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = (await req.json()) as ChatApiRequest & { address?: string };

    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json<ChatApiError>(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    let civicContext = "";
    if (body.address) {
      const civicData = await getVoterInfo(body.address);
      civicContext = "\n\n" + formatCivicDataForPrompt(civicData, body.address);
    }

    const systemInstruction = `${ELECTION_SYSTEM_PROMPT}\n\n${ELECTION_KNOWLEDGE_BASE}${civicContext}`;
    const model = getGeminiModel(systemInstruction);

    // Format history for Gemini
    const history = body.messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const latestMessage = body.messages[body.messages.length - 1].content;

    const chatSession = model.startChat({ history });

    const result = await chatSession.sendMessageStream(latestMessage);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json<ChatApiError>(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
