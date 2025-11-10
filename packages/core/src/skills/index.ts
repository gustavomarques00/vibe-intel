import type { VibeSkillContext } from "@vibe/shared";
import * as CodeReview from "./code_review";

export type SkillName = "review" | "tests" | "docs";

type SkillFn = (ctx: VibeSkillContext) => Promise<unknown>;

export const skills: Record<SkillName, SkillFn> = {
  review: CodeReview.execute,
  tests: async (ctx) => {
    // placeholder
    return { summary: "tests not implemented yet", goal: ctx.input.goal };
  },
  docs: async (ctx) => {
    // placeholder
    return { summary: "docs not implemented yet", goal: ctx.input.goal };
  }
};
