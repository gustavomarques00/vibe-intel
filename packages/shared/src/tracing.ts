import { NodeSDK } from "@opentelemetry/sdk-node";
import { trace } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

let sdk: NodeSDK | null = null;

export async function startTracing() {
  if (sdk) return;
  const exporter =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT
      ? new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT })
      : undefined;

  sdk = new NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });
  await sdk.start();
}

export async function stopTracing() {
  if (!sdk) return;
  await sdk.shutdown();
  sdk = null;
}

export function withSpan<T>(name: string, fn: () => Promise<T> | T) {
  const span = trace.getTracer("vibe-intel").startSpan(name);
  return Promise.resolve()
    .then(fn)
    .then((res) => { span.end(); return res; })
    .catch((e) => { span.recordException(e as any); span.end(); throw e; });
}
