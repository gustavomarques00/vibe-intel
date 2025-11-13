import fp from "fastify-plugin";
import { randomUUID } from "node:crypto";

export default fp(async (app) => {
  app.addHook("onRequest", async (req, reply) => {
    const cid = (req.headers["x-correlation-id"] as string) || randomUUID();
    reply.header("x-correlation-id", cid);
    (req as any).correlationId = cid;
  });
});
