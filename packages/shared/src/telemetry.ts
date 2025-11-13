/**
 * @file Telemetria base (OpenTelemetry + OTLP HTTP Exporter)
 * Responsável por inicializar tracing, spans e métricas
 * em todos os pacotes (API, Core, CLI, etc.)
 */

import process from "node:process";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

let sdk: NodeSDK | null = null;

/**
 * Inicializa a telemetria base da aplicação.
 * @param serviceName Nome lógico do serviço (ex: vibe-api, vibe-core)
 */
export async function setupTelemetry(serviceName: string) {
  const enabled = process.env.OTEL_ENABLED === "true";
  if (!enabled) {
    console.log(`[Telemetry] Disabled for ${serviceName}`);
    return;
  }

  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

  const exporter = new OTLPTraceExporter({
    url:
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
      "https://api.honeycomb.io/v1/traces",
    headers: process.env.OTEL_EXPORTER_OTLP_HEADERS
      ? Object.fromEntries(
          process.env.OTEL_EXPORTER_OTLP_HEADERS.split(",").map((p) =>
            p.split("=")
          )
        )
      : undefined,
  });

  sdk = new NodeSDK({
    traceExporter: exporter,
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
        process.env.NODE_ENV || "development",
      [SemanticResourceAttributes.SERVICE_VERSION]:
        process.env.npm_package_version || "0.1.0",
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  try {
    await sdk.start();
    console.log(`[Telemetry] Initialized for service: ${serviceName}`);
    console.log(
      `[Telemetry] Exporting to ${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`
    );
  } catch (err) {
    console.error("[Telemetry] Failed to initialize", err);
  }

  // graceful shutdown
  const shutdown = async () => {
    console.log("[Telemetry] Shutting down...");
    await sdk?.shutdown().catch((err) =>
      console.error("[Telemetry] Error during shutdown", err)
    );
    process.exit(0);
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

/**
 * Encerramento manual (ex: testes, scripts)
 */
export async function shutdownTelemetry() {
  if (sdk) {
    await sdk.shutdown();
    console.log("[Telemetry] SDK shutdown complete");
  }
}
