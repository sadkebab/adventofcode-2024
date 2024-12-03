import { joinIterators } from "../src/lib/iterators";
import { describe, it, expect } from "bun:test";

function* a() {
  yield 0;
  yield 2;
  yield 4;
  yield 5;
}

function* b() {
  yield 3;
  yield 7;
  yield 32;
}

function* c() {
  yield 1;
  yield 6;
  yield 8;
}

describe("joinIterators", () => {
  it("should join iterators", () => {
    const gen = joinIterators((a, b) => a - b, a(), b(), c());
    const values = Array.from(gen);
    expect(isSorted(...values)).toBe(true);
  });
});

function isSorted(...arr: number[]) {
  return arr.every((v, i) => i === 0 || arr[i - 1] <= v);
}
