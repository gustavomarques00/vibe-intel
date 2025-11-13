import pino from "pino";
const isDev = process.env.NODE_ENV !== "production";
const base = {
    level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
    redact: ["req.headers.authorization", "password", "*.secret"],
    timestamp: pino.stdTimeFunctions.isoTime,
};
export function createLogger(context, extra) {
    const transport = isDev ? { target: "pino-pretty", options: { colorize: true } } : undefined;
    const logger = pino({ ...base, transport }).child({ context, ...extra });
    return {
        child(bindings = {}) { return logger.child(bindings); },
        info: logger.info.bind(logger),
        debug: logger.debug.bind(logger),
        warn: logger.warn.bind(logger),
        error: logger.error.bind(logger),
        fatal: logger.fatal.bind(logger),
    };
}
//# sourceMappingURL=logging.js.map