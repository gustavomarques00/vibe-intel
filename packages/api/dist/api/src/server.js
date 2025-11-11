import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import { registerHealthRoute } from "./routes/v1/health.js";
import { registerTasksRoute } from "./routes/v1/tasks.js";
import { reviewHandler } from "./routes/v1/review.js";
dotenv.config({ path: ".env.local" });
async function buildServer() {
    const app = Fastify({ logger: true });
    // ─── Core middlewares ───────────────────────────────────────────────
    await app.register(cors, { origin: "*" });
    await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
    await app.register(jwt, {
        secret: process.env.JWT_SECRET || "development_secret",
    });
    // ─── JWT decorator ──────────────────────────────────────────────────
    app.decorate("authenticate", async (req, reply) => {
        try {
            await req.jwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
    // ─── Routes ─────────────────────────────────────────────────────────
    await registerHealthRoute(app);
    await registerTasksRoute(app);
    app.post("/v1/review", reviewHandler);
    return app;
}
async function startServer() {
    const app = await buildServer();
    const port = Number(process.env.PORT || 3333);
    try {
        await app.listen({ port, host: "0.0.0.0" });
        console.log(`✅ Server running at http://localhost:${port}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
startServer();
