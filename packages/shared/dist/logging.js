export function logMCP(event) {
    if (process.env.VIBE_AUDIT_LOGS === "1") {
        // simples: log no stdout; pode trocar depois por DB, queue, etc.
        // Mantém formato JSON para fácil ingestão.
        // Não usa any.
        // eslint-disable-next-line no-console
        console.log("[MCP]", JSON.stringify(event));
    }
}
//# sourceMappingURL=logging.js.map