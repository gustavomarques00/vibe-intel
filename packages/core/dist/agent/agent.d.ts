import type { VibeRunInput } from "@vibe/shared";
export declare function runTask(input: VibeRunInput): Promise<{
    intent: import("./intent").Intent;
    result: unknown;
}>;
