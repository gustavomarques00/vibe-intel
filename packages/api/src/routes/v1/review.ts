import type { FastifyRequest, FastifyReply } from "fastify";
import { runAgent, CodeReviewInputSchema } from "@devflow-modules/vibe-core";
import type { CodeReviewInput } from "@devflow-modules/vibe-core";
import { trace } from "@opentelemetry/api";

interface ReviewBody {
  skill: "code_review";
  payload: CodeReviewInput;
}

export async function reviewHandler(
  request: FastifyRequest<{ Body: ReviewBody["payload"] }>,
  reply: FastifyReply,
): Promise<void> {
  const log = (request as any).log;
  const tracer = trace.getTracer("vibe-api");

  await (request as any).withSpan?.("reviewHandler", async () => {
    const validation = CodeReviewInputSchema.safeParse(request.body);

    if (!validation.success) {
      log?.warn({
        msg: "review:invalid_payload",
        issues: validation.error.issues,
      });

      reply.code(400).send({
        ok: false,
        error: "Invalid payload",
        issues: validation.error.issues,
      });
      return;
    }

    const payload = validation.data;

    try {
      log?.info({ msg: "review:start", skill: "code_review" });

      const result = await runAgent({
        skill: "code_review",
        payload,
        context: {
          projectRoot: process.cwd(),
          env: "cloud",
          model: "gpt-4o-mini",
          telemetry: {
            onEvent(event: any) {
              log?.debug({
                msg: "review:event",
                type: event.type,
                skill: event.skill,
                data: event.payload ?? event.result,
              });
            },
          },
        },
      });

      log?.info({ msg: "review:success" });
      reply.code(200).send({ ok: true, result });
    } catch (err) {
      log?.error({ msg: "review:error", err });
      reply.code(500).send({ ok: false, error: "Internal error" });
    }
  });
}
