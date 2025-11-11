import { FastifyInstance, FastifyPluginAsync } from "fastify";
import jwt from "@fastify/jwt";

export const registerAuth: FastifyPluginAsync = async (app: FastifyInstance) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || "development_secret",
  });

  app.decorate(
    "authenticate",
    async (req: any, reply: any) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
};
