import fp from "fastify-plugin";
import { AppError, errorToJSON } from "@devflow-modules/vibe-shared";

export default fp(async (app) => {
  app.setErrorHandler((err, req, reply) => {
    const log = (req as any).log;
    const isApp = err instanceof AppError;
    const status = isApp ? (err as AppError).status : 500;
    log?.error({ msg: "request:error", err });
    reply.status(status).send(errorToJSON(err));
  });
});
