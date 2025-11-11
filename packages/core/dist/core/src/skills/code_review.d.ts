import { z } from "zod";
import type { VibeSkillContext } from "@devflow-modules/vibe-shared";
export declare const CodeReviewInputSchema: z.ZodObject<{
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
    }, z.core.$strip>>;
    language: z.ZodDefault<z.ZodString>;
    framework: z.ZodOptional<z.ZodString>;
    focus: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        bugs: "bugs";
        style: "style";
        performance: "performance";
        security: "security";
        architecture: "architecture";
    }>>>;
}, z.core.$strip>;
export type CodeReviewInput = z.infer<typeof CodeReviewInputSchema>;
export interface CodeReviewFinding {
    file: string;
    severity: "info" | "minor" | "major" | "critical";
    line?: number;
    message: string;
    suggestion?: string;
}
export interface CodeReviewResult {
    summary: string;
    findings: CodeReviewFinding[];
    metrics: {
        filesCount: number;
        chars: number;
    };
}
export declare function runCodeReview(payload: unknown, ctx: VibeSkillContext): Promise<CodeReviewResult>;
