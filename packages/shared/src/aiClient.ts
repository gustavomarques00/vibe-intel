import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Corrige caminho absoluto da raiz (funciona em Windows)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../../.env.local");
dotenv.config({ path: envPath });

import OpenAI from "openai";
import type { VibeAIRequest, VibeAIResponse } from "./types.js";

if (!process.env.OPENAI_API_KEY) {
  console.error(`❌ OPENAI_API_KEY não encontrada.
Verifique o arquivo .env.local na raiz (${envPath})`);
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function ai(request: VibeAIRequest): Promise<VibeAIResponse> {
  const completion = await client.chat.completions.create({
    model: request.model ?? "gpt-4o-mini",
    messages: request.messages,
    temperature: request.temperature ?? 0.2,
    max_tokens: request.maxTokens ?? 2000,
    metadata: {
      source: "vibe-intel/aiClient",
      skill: request.skill ?? "unknown",
      env: request.env ?? "unknown",
    },
  });

  const content = completion.choices[0]?.message?.content ?? "";

  return {
    raw: completion,
    content,
  };
}
