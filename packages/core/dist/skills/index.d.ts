import type { VibeSkillContext } from "@vibe/shared";
export type SkillName = "review" | "tests" | "docs";
type SkillFn = (ctx: VibeSkillContext) => Promise<unknown>;
export declare const skills: Record<SkillName, SkillFn>;
export {};
