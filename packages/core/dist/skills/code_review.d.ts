import { z } from "zod";
import type { VibeSkillContext } from "@vibe/shared";
declare const ReviewSchema: z.ZodObject<{
    summary: z.ZodString;
    issues: z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        type: z.ZodEnum<["bug", "perf", "security", "style"]>;
        reason: z.ZodString;
        fix: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "bug" | "perf" | "security" | "style";
        file: string;
        reason: string;
        fix: string;
        line?: number | undefined;
    }, {
        type: "bug" | "perf" | "security" | "style";
        file: string;
        reason: string;
        fix: string;
        line?: number | undefined;
    }>, "many">;
    risk: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    issues: {
        type: "bug" | "perf" | "security" | "style";
        file: string;
        reason: string;
        fix: string;
        line?: number | undefined;
    }[];
    risk: "low" | "medium" | "high";
}, {
    summary: string;
    issues: {
        type: "bug" | "perf" | "security" | "style";
        file: string;
        reason: string;
        fix: string;
        line?: number | undefined;
    }[];
    risk: "low" | "medium" | "high";
}>;
export type ReviewResult = z.infer<typeof ReviewSchema>;
export declare function execute({ ai, input }: VibeSkillContext): Promise<ReviewResult>;
export {};
