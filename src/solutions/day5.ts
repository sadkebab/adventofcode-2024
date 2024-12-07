import { partition } from "lodash";

export function solution(lines: string[]): [number, number] {
  const [instructionsLines, updatedLines] = lines
    .join("\n")
    .split("\n\n")
    .map((s) => s.split("\n"));

  const { rules, sum, invalid } = validUpdates(instructionsLines, updatedLines);

  return [sum, fixedInvalidUpdates(rules, invalid)];
}

function validUpdates(instructionsLines: string[], updatedLines: string[]) {
  const instructions = instructionsLines.map((line) =>
    line.split("|").map(Number)
  );

  const rules = instructions.reduce((acc, [left, right]) => {
    acc.set(right, (acc.get(right) || new Set()).add(left));
    return acc;
  }, new Map<number, Set<number>>());

  const updated = updatedLines.map((line) => line.split(",").map(Number));

  const [valid, invalid] = partition(updated, (line) =>
    line.every((n, i, arr) => {
      const set = rules.get(n);
      return !set || !arr.slice(i + 1).some((m) => set.has(m));
    })
  );

  const sum = valid.reduce(
    (acc, line) => acc + line[Math.floor(line.length / 2)],
    0
  );

  return { rules, sum, invalid };
}

function fixedInvalidUpdates(
  rules: Map<number, Set<number>>,
  invalidUpdates: number[][]
) {
  return invalidUpdates
    .map((n) => n.sort((a, b) => (rules.get(b)?.has(a) ? -1 : 1)))
    .reduce((acc, line) => acc + line[Math.floor(line.length / 2)], 0);
}
