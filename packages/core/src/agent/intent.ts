import type { VibeRunInput } from "@vibe/shared";

export type Intent = "review" | "tests" | "docs";

export async function detectIntent(input: VibeRunInput): Promise<Intent> {
  // Versão inicial: usa goal direto
  if (input.goal === "tests" || input.goal === "docs") {
    return input.goal;
  }
  return "review";
}
