import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq("openai/gpt-oss-120b"),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
