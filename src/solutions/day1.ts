import { zip } from "lodash";

export function solution(lines: string[]): [number, number] {
  return [distance(lines), similarity(lines)];
}

function distance(lines: string[]): number {
  return zip(
    ...lines
      .reduce(
        (acc, line) => {
          const [left, right] = line.split(/\s+/).map(Number);
          acc[0].push(left);
          acc[1].push(right);
          return acc;
        },
        [[], []] as [number[], number[]]
      )
      .map((arr) => arr.sort((a, b) => a - b))
  )
    .map(([l, r]) => Math.abs(l! - r!))
    .reduce((acc, curr) => acc + curr, 0);
}

function similarity(lines: string[]): number {
  const [left, frequencyMap] = lines.reduce(
    (acc, line) => {
      const [left, right] = line.split(/\s+/).map(Number);
      acc[0].push(left);
      acc[1].set(right, (acc[1].get(right) ?? 0) + 1);
      return acc;
    },
    [[], new Map<number, number>()] as [number[], Map<number, number>]
  );

  return left
    .map((x) => x * (frequencyMap.get(x) ?? 0))
    .reduce((acc, curr) => acc + curr, 0);
}
