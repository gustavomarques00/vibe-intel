import type { VibeSkillContext } from "@devflow-modules/vibe-shared";
export type SkillRunner = (payload: unknown, ctx: VibeSkillContext) => Promise<unknown>;
export declare function getSkill(name: string): SkillRunner;
