import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const openrouter = createOpenAI({
  apiKey: process.env.OPEN_ROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: Request) {
  const body = await request.json();

  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (message: unknown) =>
            typeof message === "object" &&
            message !== null &&
            "role" in message &&
            "content" in message &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string" &&
            message.content.trim().length > 0,
        )
        .map((message: { role: "user" | "assistant"; content: string }) => ({
          role: message.role,
          content: message.content,
        }))
    : [];

  if (messages.length === 0) {
    return new Response("No messages provided", { status: 400 });
  }

  const result = streamText({
    model: openrouter("google/gemini-2.5-flash"),
    messages,
    maxOutputTokens: 2000,
  });

  return result.toTextStreamResponse();
}
