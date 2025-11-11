import { FastifyInstance } from "fastify";
import { z } from "zod";
import { runAgent } from "@devflow-modules/vibe-core";

const BodySchema = z.object({
  goal: z.enum(["review", "tests", "docs"]),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string().max(150_000)
    })
  )
});

export async function registerTasksRoute(fastify: FastifyInstance) {
  fastify.post(
    "/v1/tasks",
    { preValidation: [(fastify as any).authenticate] },
    async (req, res) => {
      const input = BodySchema.parse(req.body as unknown);

      const result = await runAgent({
        skill: input.goal, // usamos o campo 'goal' como nome da skill
        payload: { files: input.files },
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
    },
  );

}
