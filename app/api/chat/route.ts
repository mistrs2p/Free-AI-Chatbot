import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const openrouter = createOpenAI({
  apiKey: process.env.OPEN_ROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: Request) {
  const body = await request.json();

  const result = streamText({
    model: openrouter("google/gemini-2.5-flash"),
    prompt: body.content,
    maxOutputTokens: 2000,
  });

  return result.toTextStreamResponse();
}
