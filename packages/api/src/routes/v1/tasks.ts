import { FastifyInstance } from "fastify";
import { z } from "zod";
import { runAgent } from "@devflow-modules/vibe-core";
import { trace } from "@opentelemetry/api";

const BodySchema = z.object({
  goal: z.enum(["review", "tests", "docs"]),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string().max(150_000),
    })
  ),
});

export async function registerTasksRoute(fastify: FastifyInstance) {
  fastify.post(
    "/v1/tasks",
    { preValidation: [(fastify as any).authenticate] },
    async (req, res) => {
      const log = (req as any).log;
      const tracer = trace.getTracer("vibe-api");

      await (req as any).withSpan?.("tasksHandler", async () => {
        try {
          const input = BodySchema.parse(req.body);

      const payload = {
        files: input.files,
        language: "typescript" as const,
        focus: ["bugs", "style", "architecture"] as (
          "bugs" | "style" | "architecture" | "performance" | "security"
        )[],
      };

          log?.info({ msg: "tasks:start", goal: input.goal });

          const result = await runAgent({
            skill: "code_review",
            payload,
            context: {
              env: "cloud",
              model: "gpt-4o-mini",
              telemetry: {
                onEvent(event) {
                  log?.debug({
                    msg: "tasks:event",
                    type: event.type,
                    skill: event.skill,
                    data: event.payload ?? event.result,
                  });
                },
              },
            },
          });

          log?.info({ msg: "tasks:success" });
          res.code(200).send({ ok: true, result });
        } catch (err) {
          log?.error({ msg: "tasks:error", err });
          res.code(400).send({ ok: false, error: "Invalid or failed request" });
        }
      });
    }
  );
}
