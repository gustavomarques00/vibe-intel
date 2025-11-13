export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;
  constructor(message: string, opts: { code?: string; status?: number; details?: unknown } = {}) {
    super(message);
    this.name = "AppError";
    this.code = opts.code ?? "APP_ERROR";
    this.status = opts.status ?? 400;
    this.details = opts.details;
  }
}
export function errorToJSON(err: unknown) {
  const e = err as any;
  return {
    name: e?.name ?? "Error",
    message: e?.message ?? String(err),
    code: e?.code,
    status: e?.status,
    stack: process.env.NODE_ENV === "production" ? undefined : e?.stack,
    details: e?.details,
  };
}
