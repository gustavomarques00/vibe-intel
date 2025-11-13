/**
 * @file Fastify Plugin — Telemetria por requisição
 * Injeta tracing (spans) e contexto em cada request.
 * Depende de setupTelemetry() inicializado em vibe-shared.
 */

import fp from "fastify-plugin";
import { trace, context, ROOT_CONTEXT } from "@opentelemetry/api";

/**
 * Adiciona tracing automático por requisição.
 * - Cria um span por rota
 * - Injeta método req.withSpan() para spans internos
 */
export default fp(async (app) => {
  const tracer = trace.getTracer("vibe-api");

  app.addHook("onRequest", async (req: any) => {
    const span = tracer.startSpan(`${req.method} ${req.url}`, undefined, ROOT_CONTEXT);
    req._otelSpan = span;

    // Propaga contexto ativo
    const ctx = trace.setSpan(context.active(), span);
    req._otelContext = ctx;
  });

  app.addHook("preHandler", async (req: any) => {
    // Adiciona helper utilitário
    req.withSpan = async <T>(name: string, fn: () => Promise<T> | T): Promise<T> => {
      const span = tracer.startSpan(name, undefined, req._otelContext || ROOT_CONTEXT);
      try {
        const result = await fn();
        span.setStatus({ code: 1 }); // OK
        return result;
      } catch (err) {
        span.recordException(err as Error);
        span.setStatus({ code: 2, message: (err as Error).message });
        throw err;
      } finally {
        span.end();
      }
    };
  });

  app.addHook("onResponse", async (req: any, reply: any) => {
    const span = req._otelSpan;
    if (span) {
      span.setAttributes({
        "http.method": req.method,
        "http.url": req.url,
        "http.status_code": reply.statusCode,
        "correlation.id": req.correlationId,
      });
      span.end();
    }
  });

  app.addHook("onError", async (req: any, reply: any, err: Error) => {
    const span = req._otelSpan;
    if (span) {
      span.recordException(err);
      span.setStatus({ code: 2, message: err.message });
      span.end();
    }
  });
});
