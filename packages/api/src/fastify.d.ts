import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: import("fastify").onRequestHookHandler;
  }

  interface FastifyRequest {
    jwtVerify: () => Promise<void>;
  }
}
