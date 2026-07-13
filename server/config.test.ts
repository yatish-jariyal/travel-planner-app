import { describe, expect, it } from "vitest";
import {
  loadConfig,
  requireSecret,
  ServiceConfigurationError,
} from "./config.js";

describe("server configuration", () => {
  it("uses safe local defaults without requiring secrets at startup", () => {
    const config = loadConfig({});

    expect(config.port).toBe(3000);
    expect(config.gemini.model).toBe("gemini-3.5-flash");
    expect(config.frontendOrigins).toEqual(["http://localhost:5173"]);
  });

  it("requires both optional Google Search values", () => {
    expect(() => loadConfig({ GOOGLE_SEARCH_API_KEY: "key" })).toThrow(
      "GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID"
    );
  });

  it("reports missing provider secrets without exposing values", () => {
    expect(() => requireSecret("GEMINI_API_KEY", undefined)).toThrow(
      ServiceConfigurationError
    );
  });
});
