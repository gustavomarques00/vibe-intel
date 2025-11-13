import { FastifyInstance } from "fastify";
import { trace } from "@opentelemetry/api";

export async function registerHealthRoute(app: FastifyInstance) {
  app.get("/v1/health", async (req, reply) => {
    // 🔹 Inicia um span específico para esta rota
    const tracer = trace.getTracer("vibe-api");
    const span = tracer.startSpan("health-check");

    const start = Date.now();

    try {
      const data = {
        ok: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };

      // 🔹 Log estruturado com contexto e correlação
      const log = (req as any).log;
      log?.info({
        msg: "health:check",
        uptime: data.uptime,
        correlationId: (req as any).correlationId,
      });

      return reply.code(200).send(data);
    } catch (err) {
      const log = (req as any).log;
      log?.error({ msg: "health:error", err });
      return reply.code(500).send({ ok: false });
    } finally {
      // 🔹 Registra duração e encerra o span
      span.setAttribute("duration_ms", Date.now() - start);
      span.end();
    }
  });
}
