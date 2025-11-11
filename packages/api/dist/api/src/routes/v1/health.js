export async function registerHealthRoute(fastify) {
    fastify.get("/v1/health", async () => {
        return { ok: true, uptime: process.uptime() };
    });
}
