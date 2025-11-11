import jwt from "@fastify/jwt";
export const registerAuth = async (app) => {
    await app.register(jwt, {
        secret: process.env.JWT_SECRET || "development_secret",
    });
    app.decorate("authenticate", async (req, reply) => {
        try {
            await req.jwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
};
