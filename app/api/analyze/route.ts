import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/prompts/system-prompt";
import { MODEL, MAX_TOKENS } from "@/lib/constants";
import { parseAnalysisResponse } from "@/lib/parse-response";
import type { AnalyzeRequest, AnalyzeResponse } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    const { messages, apiKey } = body;

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        { error: "API key is required" } satisfies AnalyzeResponse,
        { status: 401 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" } satisfies AnalyzeResponse,
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })) as Anthropic.MessageParam[],
    });

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );

    if (!textBlock) {
      return NextResponse.json(
        { error: "No text response from Claude" } satisfies AnalyzeResponse,
        { status: 500 }
      );
    }

    const analysis = parseAnalysisResponse(textBlock.text);

    return NextResponse.json({
      analysis,
      rawText: textBlock.text,
    } satisfies AnalyzeResponse);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your Anthropic API key." } satisfies AnalyzeResponse,
        { status: 401 }
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment and try again." } satisfies AnalyzeResponse,
        { status: 429 }
      );
    }
    if (error instanceof Anthropic.BadRequestError) {
      return NextResponse.json(
        { error: `Bad request: ${error.message}` } satisfies AnalyzeResponse,
        { status: 400 }
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse Claude's response as valid nutritional data. Please try again." } satisfies AnalyzeResponse,
        { status: 500 }
      );
    }

    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: message } satisfies AnalyzeResponse,
      { status: 500 }
    );
  }
}
