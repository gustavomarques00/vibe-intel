import { runAgent, CodeReviewInputSchema } from "@devflow-modules/vibe-core";
export async function reviewHandler(request, reply) {
    const validation = CodeReviewInputSchema.safeParse(request.body);
    if (!validation.success) {
        reply.code(400).send({
            ok: false,
            error: "Invalid payload",
            issues: validation.error.issues,
        });
        return;
    }
    const payload = validation.data;
    const result = await runAgent({
        skill: "code_review",
        payload,
        context: {
            projectRoot: process.cwd(),
            env: "cloud",
            model: "gpt-4o-mini",
            telemetry: {
                onEvent(event) {
                    console.log(`[${event.type}] ${event.skill}`, event.payload ?? event.result);
                }
            },
        },
    });
    reply.code(200).send({ ok: true, result });
}
