import { describe, expect, it } from "vitest";
import { requireEnvironmentVariable } from "./env";

describe("requireEnvironmentVariable", () => {
  it("returns a trimmed configured value", () => {
    expect(requireEnvironmentVariable("VITE_EXAMPLE", " configured ")).toBe(
      "configured"
    );
  });

  it.each([undefined, null, "", "   "])(
    "rejects a missing value: %s",
    (value) => {
      expect(() => requireEnvironmentVariable("VITE_EXAMPLE", value)).toThrow(
        "Missing required environment variable: VITE_EXAMPLE."
      );
    }
  );
});
