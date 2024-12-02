import * as Match from "@effect/match";
import { range } from "lodash";

export function solution(lines: string[]): [number, number] {
  return [intollerantSafeLevels(lines), tollerantSafeLevels(lines)];
}

type SafetySequenceState =
  | {
      status: "start";
    }
  | {
      status: "neutral";
      lastValue: number;
    }
  | {
      status: "increase" | "decrease";
      lastValue: number;
    }
  | {
      status: "unsafe";
      array: number[];
    };

function intollerantSafeLevels(lines: string[]): number {
  return lines
    .map((line) =>
      line
        .split(/\s+/)
        .map(Number)
        .reduce<SafetySequenceState>(safeSequenceReducer, { status: "start" })
    )
    .filter(({ status }) => status !== "unsafe").length;
}

function tollerantSafeLevels(lines: string[]): number {
  return lines
    .map((line) =>
      line
        .split(/\s+/)
        .map(Number)
        .reduce<SafetySequenceState>(safeSequenceReducer, {
          status: "start",
        })
    )
    .map((result) =>
      Match.value(result).pipe(
        Match.when({ status: "unsafe" }, (original) => {
          return (
            range(0, original.array.length)
              .map((idx) => {
                return original.array
                  .slice(0, idx)
                  .concat(original.array.slice(idx + 1))
                  .reduce<SafetySequenceState>(safeSequenceReducer, {
                    status: "start",
                  });
              })
              .find(({ status }) => status !== "unsafe") ?? original
          );
        }),
        Match.orElse((result) => result)
      )
    )
    .filter(({ status }) => status !== "unsafe").length;
}

const safeSequenceReducer = (
  acc: SafetySequenceState,
  curr: number,
  _: number,
  array: number[]
): SafetySequenceState => {
  return Match.value(acc).pipe(
    Match.when({ status: "start" }, () => ({
      status: "neutral" as const,
      lastValue: curr,
    })),
    Match.when({ status: "neutral" }, ({ lastValue }) => {
      const delta = Math.abs(curr - lastValue);
      const isSafe = delta <= 3 && delta > 0;
      const direction =
        curr > lastValue ? ("increase" as const) : ("decrease" as const);

      return isSafe
        ? {
            status: direction,
            lastValue: curr,
          }
        : {
            status: "unsafe" as const,
            array: array,
          };
    }),
    Match.when({ status: "increase" }, ({ lastValue }) => {
      const delta = curr - lastValue;
      const isSafe = delta <= 3 && delta > 0;

      return isSafe
        ? {
            status: "increase" as const,
            lastValue: curr,
          }
        : {
            status: "unsafe" as const,
            array: array,
          };
    }),
    Match.when({ status: "decrease" }, ({ lastValue }) => {
      const delta = lastValue - curr;
      const isSafe = delta <= 3 && delta > 0;

      return isSafe
        ? {
            status: "decrease" as const,
            lastValue: curr,
          }
        : {
            status: "unsafe" as const,
            array: array,
          };
    }),
    Match.when({ status: "unsafe" }, (same) => same),
    Match.exhaustive
  );
};
