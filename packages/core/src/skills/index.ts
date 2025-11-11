import { runCodeReview } from "./code_review.js";
import type { VibeSkillContext } from "@devflow-modules/vibe-shared";

export type SkillRunner = (payload: unknown, ctx: VibeSkillContext) => Promise<unknown>;

const skills: Record<string, SkillRunner> = {
  code_review: runCodeReview,
};

export function getSkill(name: string): SkillRunner {
  const skill = skills[name];
  if (!skill) throw new Error(`Skill not found: ${name}`);
  return skill;
}
