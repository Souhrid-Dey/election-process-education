import { NextRequest, NextResponse } from "next/server";
import { getGenAI, MODEL_NAME } from "@/lib/gemini";
import { ELECTION_SYSTEM_PROMPT, ELECTION_KNOWLEDGE_BASE } from "@/lib/prompts";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatApiRequest {
  messages: ChatMessage[];
  civicContext?: string | null;
}

interface ChatApiError {
  error: string;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = (await req.json()) as ChatApiRequest;

    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json<ChatApiError>(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    // Build system instruction with optional civic context injected at runtime
    let systemInstruction = `${ELECTION_SYSTEM_PROMPT}\n\n${ELECTION_KNOWLEDGE_BASE}`;
    if (body.civicContext) {
      systemInstruction +=
        `\n\n=== USER'S CIVIC INFORMATION (from Google Civic Information API) ===\n` +
        `Answer all location-specific questions using this data directly and precisely.\n` +
        `If something is not listed below, respond: "This information is not available in source: Google Civic public data."\n\n` +
        body.civicContext +
        `\n=== END CIVIC INFORMATION ===`;
    }

    // Build contents array: history messages + latest user message
    // Strictly alternate user/model roles as required by Gemini
    const allMessages = body.messages.filter((m) => m.role !== "widget" && m.content?.trim());

    const rawContents: { role: string; parts: { text: string }[] }[] = allMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content || " " }],
    }));

    // Collapse consecutive same-role messages (Gemini requires strict alternation)
    const contents: { role: string; parts: { text: string }[] }[] = [];
    for (const msg of rawContents) {
      if (contents.length > 0 && contents[contents.length - 1].role === msg.role) {
        contents[contents.length - 1].parts[0].text += "\n" + msg.parts[0].text;
      } else {
        contents.push(msg);
      }
    }

    // Gemini requires contents to start with a user turn
    while (contents.length > 0 && contents[0].role !== "user") {
      contents.shift();
    }

    if (contents.length === 0) {
      return NextResponse.json<ChatApiError>(
        { error: "No valid messages to send" },
        { status: 400 }
      );
    }

    const ai = getGenAI();

    let streamResult: any;
    try {
      streamResult = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents,
        config: {
          systemInstruction,
        },
      });
    } catch (geminiErr: any) {
      const geminiMsg = geminiErr?.message || "Unknown Gemini error";
      console.error("Gemini API call failed:", geminiMsg);
      return NextResponse.json<ChatApiError>(
        { error: `Gemini error: ${geminiMsg}` },
        { status: 500 }
      );
    }

    // Stream the response tokens back to the client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult) {
            // In @google/genai v1.51+, chunk.text is a getter property (not a method)
            const text = chunk.text;
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (e: any) {
          console.error("Stream error:", e?.message);
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
    console.error("Chat API Error:", error.message);
    return NextResponse.json<ChatApiError>(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
