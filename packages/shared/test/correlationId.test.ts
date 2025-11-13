import { buildServer } from "packages/api/src/server.js";
import { describe, it, expect } from "vitest";


describe("correlationId", () => {
  it("injeta header e ecoa no response", async () => {
    const app = await buildServer();
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.headers["x-correlation-id"]).toBeTruthy();
  });
});
