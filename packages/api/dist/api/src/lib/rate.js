import rateLimit from "@fastify/rate-limit";
export const registerRateLimit = async (app) => {
    await app.register(rateLimit, {
        max: 100,
        timeWindow: "1 minute",
    });
};
