"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const zod_1 = require("zod");
const ReviewSchema = zod_1.z.object({
    summary: zod_1.z.string(),
    issues: zod_1.z.array(zod_1.z.object({
        file: zod_1.z.string(),
        line: zod_1.z.number().optional(),
        type: zod_1.z.enum(["bug", "perf", "security", "style"]),
        reason: zod_1.z.string(),
        fix: zod_1.z.string()
    })),
    risk: zod_1.z.enum(["low", "medium", "high"])
});
async function execute({ ai, input }) {
    const messages = [
        {
            role: "system",
            content: "Você é um revisor sênior. Responda em JSON estrito seguindo o schema esperado."
        },
        {
            role: "user",
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
    const parsed = first?.content ?? {};
    return parsed;
}
