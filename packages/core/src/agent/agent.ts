import { ai } from "@vibe/shared";
import type { VibeRunInput } from "@vibe/shared";
import { detectIntent } from "./intent";
import { skills } from "../skills";

export async function runTask(input: VibeRunInput) {
  const intent = await detectIntent(input);

  const skill = skills[intent] ?? skills.review;

  const result = await skill({
    ai,
    input
  });

  return {
    intent,
    result
  };
}
