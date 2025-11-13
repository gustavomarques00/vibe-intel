import { describe, it, expect } from "vitest";
import { createLogger } from "../src/logging.js";

describe("logger", () => {
  it("cria child com contexto", () => {
    const log = createLogger("test");
    const child = log.child({ correlationId: "abc" });
    expect(typeof child.info).toBe("function");
  });
});
