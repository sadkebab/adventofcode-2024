import { describe, it, expect } from "bun:test";
import { regexMatchCount } from "../src/lib/regex";

describe("regexMatchCount", () => {
  it("should count matches", () => {
    expect(
      regexMatchCount(/xmas/i, "xmas", "samxmas", "xsa", "xamasx", "fa", "fo")
    ).toBe(2);
  });
});
