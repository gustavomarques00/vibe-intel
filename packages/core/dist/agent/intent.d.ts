import type { VibeRunInput } from "@vibe/shared";
export type Intent = "review" | "tests" | "docs";
export declare function detectIntent(input: VibeRunInput): Promise<Intent>;
