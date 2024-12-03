import { readFileSync } from "fs";
import { run } from "./lib/runner";
import { args } from "./lib/args";
import path from "path";
import { range } from "lodash";
import chalk from "chalk";
import { existsSync } from "fs";
type Solution = {
  solution: (lines: string[]) => [number, number];
};

run(
  async () => {
    const { target, day, mode } = args();

    if (day) {
      await runDay(day, target, mode).then((result) => {
        printResult(day, result);
      });

      process.exit(0);
    }

    await Promise.all(
      range(1, 25).map((day) => runDay(day, target, mode))
    ).then((results) => {
      results.forEach((result, index) => {
        printResult(index + 1, result);
      });
    });

    process.exit(0);
  },
  {
    onError: (error) => {
      console.error(error);
      process.exit(1);
    },
  }
);

function printResult(day: number, result: [number, number] | string) {
  if (typeof result === "string") {
    console.log(
      chalk.green(`[Day ${day.toString().padEnd(2)}]`),
      chalk.gray(`${result}`)
    );
  } else {
    const [partOne, partTwo] = result;
    console.log(
      chalk.green(`[Day ${day.toString().padEnd(2)}]`),
      chalk.cyan(`${partOne}, ${partTwo}`)
    );
  }
}

async function runDay(day: number, target: string, mode: string) {
  try {
    const solution = (await import(
      path.join(__dirname, `./solutions/day${day}.ts`)
    )) as Solution;
    const input = readFileSync(path.join(target, `day${day}/${mode}`), "utf8");
    const lines = input.split("\n");
    return solution.solution(lines);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("No such file or directory")
    ) {
      return "Input file not found";
    }

    return "No solution found";
  }
}
