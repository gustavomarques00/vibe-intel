import pino from "pino";
type Ctx = {
    context?: string;
    correlationId?: string;
    [k: string]: any;
};
export declare function createLogger(context?: string, extra?: Record<string, any>): {
    child(bindings?: Ctx): pino.Logger<never, boolean>;
    info: pino.LogFn;
    debug: pino.LogFn;
    warn: pino.LogFn;
    error: pino.LogFn;
    fatal: pino.LogFn;
};
export {};
