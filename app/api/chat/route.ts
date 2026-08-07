import { NextResponse } from "next/server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openrouter = createOpenAI({
  apiKey: process.env.OPEN_ROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { text } = await generateText({
      model: openrouter("google/gemini-2.5-flash"),
      prompt: body.content,
      maxOutputTokens: 2000,
    });

    return NextResponse.json({
      message: text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate response.",
      },
      {
        status: 500,
      },
    );
  }
}
