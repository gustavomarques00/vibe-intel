import type { VibeRunInput } from "@devflow-modules/vibe-shared";
import { getSkill } from "../skills/index.js";

export async function runAgent(input: VibeRunInput): Promise<unknown> {
  const skill = getSkill(input.skill);

  // opcional: evento high-level de agent
  input.context.telemetry?.onEvent?.({
    type: "start",
    skill: input.skill,
    payload: input.payload,
    timestamp: new Date().toISOString(),
  });

  const result = await skill(input.payload, input.context);

  input.context.telemetry?.onEvent?.({
    type: "finish",
    skill: input.skill,
    result,
    timestamp: new Date().toISOString(),
  });

  return result;
}
