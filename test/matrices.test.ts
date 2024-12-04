import { describe, it, expect } from "bun:test";
import { verticalLines, obliqueLines } from "../src/lib/matrices";

describe("verticalLines", () => {
  it("should return vertical lines", () => {
    expect(
      verticalLines([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ])
    ).toEqual(["adg", "beh", "cfi"]);
  });
});

describe("obliqueLines", () => {
  it("should return oblique lines", () => {
    expect(
      obliqueLines([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
      ]).sort()
    ).toEqual(["aei", "bf", "c", "dh", "g"].sort());
  });
});

describe("obliqueLines inverse", () => {
  it("should return inverse oblique lines", () => {
    expect(
      obliqueLines(
        [
          ["a", "b", "c"],
          ["d", "e", "f"],
          ["g", "h", "i"],
        ],
        { inverse: true }
      ).sort()
    ).toEqual(["ceg", "bd", "a", "fh", "i"].sort());
  });
});
