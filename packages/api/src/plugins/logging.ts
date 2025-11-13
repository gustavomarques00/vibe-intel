import fp from "fastify-plugin";
import pino, { LoggerOptions } from "pino";
import { trace, context as otelContext } from "@opentelemetry/api";

type Ctx = { context?: string; correlationId?: string; [k: string]: any };

const isDev = process.env.NODE_ENV !== "production";

const base: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  redact: ["req.headers.authorization", "password", "*.secret"],
  timestamp: pino.stdTimeFunctions.isoTime,
};

export function createLogger(context?: string, extra?: Record<string, any>) {
  const transport = isDev ? { target: "pino-pretty", options: { colorize: true } } : undefined;
  const raw = pino({ ...base, transport }).child({ context, ...extra });

  function attachTelemetryMeta(bindings: Ctx = {}): Ctx {
    const activeSpan = trace.getSpan(otelContext.active());
    if (activeSpan) {
      bindings.traceId ??= activeSpan.spanContext().traceId;
      bindings.spanId ??= activeSpan.spanContext().spanId;
    }
    return bindings;
  }

  const wrapped = {
    child(bindings: Ctx = {}) {
      return raw.child(attachTelemetryMeta(bindings));
    },
    info: (o: any, msg?: string) => raw.info(attachTelemetryMeta(o), msg),
    debug: (o: any, msg?: string) => raw.debug(attachTelemetryMeta(o), msg),
    warn: (o: any, msg?: string) => raw.warn(attachTelemetryMeta(o), msg),
    error: (o: any, msg?: string) => raw.error(attachTelemetryMeta(o), msg),
    fatal: (o: any, msg?: string) => raw.fatal(attachTelemetryMeta(o), msg),
    raw, // instancia Pino pura para o Fastify
  };

  return wrapped;
}

/**
 * Plugin Fastify que injeta logger contextualizado por requisição
 */
export default fp(async (app) => {
  const base = createLogger("api");

  app.addHook("onRequest", async (req: any) => {
    const log = base.child({
      route: (req as any).routerPath ?? req.url,
      method: req.method,
      correlationId: (req as any).correlationId,
    });
    (req as any).log = log;
    log.info({ msg: "request:start" });
  });

  app.addHook("onResponse", async (req: any, reply: any) => {
    const log = (req as any).log;
    log?.info({
      msg: "request:finish",
      statusCode: reply.statusCode,
      duration_ms: (reply as any).getResponseTime?.(),
    });
  });
});
