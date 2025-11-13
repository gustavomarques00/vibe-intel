import fp from "fastify-plugin";
import { withSpan } from "@devflow-modules/vibe-shared";

export default fp(async (app) => {
  app.addHook("preHandler", async (req: any) => {
    (req as any).withSpan = <T>(name: string, fn: () => Promise<T> | T) => {
      const path = (req as any).routerPath ?? req.url;
      return withSpan(`${req.method} ${path} :: ${name}`, fn);
    };
  });
});
