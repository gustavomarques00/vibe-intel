import { z } from "zod";
import type { VibeSkillContext } from "@vibe/shared";

const ReviewSchema = z.object({
    summary: z.string(),
    issues: z.array(
        z.object({
            file: z.string(),
            line: z.number().optional(),
            type: z.enum(["bug", "perf", "security", "style"]),
            reason: z.string(),
            fix: z.string()
        })
    ),
    risk: z.enum(["low", "medium", "high"])
});

export type ReviewResult = z.infer<typeof ReviewSchema>;

export async function execute({ ai, input }: VibeSkillContext): Promise<ReviewResult> {
    const messages = [
        {
            role: "system" as const,
            content:
                "Você é um revisor sênior. Responda em JSON estrito seguindo o schema esperado."
        },
        {
            role: "user" as const,
            content: JSON.stringify({
                goal: input.goal,
                files: input.files
            })
        }
    ];

    const res = await ai.responses.parse({
        model: "gpt-5-turbo",
        input: messages,
        schema: ReviewSchema
    });

    const first = Array.isArray(res.output) ? res.output[0] : res.output;
    const parsed = (first as any)?.content ?? {};

    return parsed as unknown as ReviewResult;
}
