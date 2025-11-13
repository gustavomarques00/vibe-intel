import Fastify from "fastify";
import dotenv from "dotenv";

import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";

import { registerHealthRoute } from "./routes/v1/health.js";
import { registerTasksRoute } from "./routes/v1/tasks.js";
import { reviewHandler } from "./routes/v1/review.js";

// 🔹 Plugins da Sprint 2
import correlationId from "./plugins/correlationId.js";
import logging, { createLogger } from "./plugins/logging.js";
import tracing from "./plugins/tracing.js";
import telemetry from "./plugins/telemetry.js";
import errorHandler from "./plugins/errorHandler.js";

// 🔹 Observabilidade compartilhada (OpenTelemetry SDK)
import { setupTelemetry } from "@devflow-modules/vibe-shared";

dotenv.config({ path: ".env.local" });

export async function buildServer() {
  // 🚀 Inicializa OpenTelemetry antes de criar o app
  await setupTelemetry("vibe-api");

  // 🔹 Logger central do Fastify (instância Pino pura)
  const log = createLogger("api");
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
      transport: process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
    },
  });

  // ─── Core middlewares ───────────────────────────────────────────────
  await app.register(cors, { origin: "*" });
  await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || "development_secret",
  });

  // ─── Plugins de observabilidade ─────────────────────────────────────
  await app.register(correlationId);
  await app.register(logging);
  await app.register(tracing);
  await app.register(telemetry); // 🔹 Spans automáticos por requisição
  await app.register(errorHandler);

  // ─── JWT decorator ──────────────────────────────────────────────────
  app.decorate("authenticate", async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // ─── Routes ─────────────────────────────────────────────────────────
  await registerHealthRoute(app);
  await registerTasksRoute(app);
  app.post("/v1/review", reviewHandler);

  // ─── Lifecycle ──────────────────────────────────────────────────────
  app.ready().then(() => log.info("✅ Fastify app ready"));

  return app;
}

export async function startServer() {
  const app = await buildServer();
  const port = Number(process.env.PORT || 3333);

  try {
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`✅ Server running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") startServer();
