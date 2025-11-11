import { FastifyInstance, FastifyPluginAsync } from "fastify";
import rateLimit from "@fastify/rate-limit";

export const registerRateLimit: FastifyPluginAsync = async (
  app: FastifyInstance
) => {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
};
