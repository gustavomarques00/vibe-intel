import type { FastifyRequest, FastifyReply } from "fastify";
import { runAgent, CodeReviewInputSchema } from "@devflow-modules/vibe-core";
import type { CodeReviewInput } from "@devflow-modules/vibe-core";

interface ReviewBody {
  skill: "code_review";
  payload: CodeReviewInput;
}

export async function reviewHandler(
  request: FastifyRequest<{ Body: ReviewBody["payload"] }>,
  reply: FastifyReply,
): Promise<void> {
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
        onEvent(event: any) {
          console.log(`[${event.type}] ${event.skill}`, event.payload ?? event.result);
        }
      },
    },
  });

  reply.code(200).send({ ok: true, result });
}
