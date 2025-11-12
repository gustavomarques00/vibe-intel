import { FastifyInstance } from "fastify";
import { z } from "zod";
import { runAgent } from "@devflow-modules/vibe-core";

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
      const input = BodySchema.parse(req.body);

      // Mapeia todos os goals para skill única por enquanto
      const skill = "code_review";

      // Ajusta payload mínimo compatível com CodeReviewInput
      const payload = {
        files: input.files,
        language: "typescript",
        focus: ["bugs", "style", "architecture"],
      };

      const result = await runAgent({
        skill: "code_review",
        payload: {
          files: input.files,
          language: "typescript" as const,
          focus: ["bugs", "style", "architecture"] as const,
        },
        context: {
          env: "cloud",
          model: "gpt-4o-mini",
          telemetry: {
            onEvent(event) {
              console.log(`[${event.type}] ${event.skill}`, event.payload ?? event.result);
            },
          },
        },
      });

      return res.send({ ok: true, result });
    }
  );
}
