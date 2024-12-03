export function solution(lines: string[]): [number, number] {
  return [
    sum(evalMul(parseMul(lines))),
    sum(evalMul(parseMulWithDoAndDont(lines))),
  ];
}

const mulRegex = /mul\((\d+),(\d+)\)/g;

function* parseMul(lines: string[]): Generator<[number, number]> {
  for (const line of lines) {
    const matches = line.matchAll(mulRegex);

    for (const match of matches) {
      const [a, b] = match.slice(1).map(Number);

      yield [Number(a), Number(b)];
    }
  }
}

type ParsedCommand =
  | {
      type: "mul";
      a: number;
      b: number;
      index: number;
    }
  | {
      type: "do";
      index: number;
    }
  | {
      type: "dont";
      index: number;
    };

const doRegex = /do\(\)/g;
const dontRegex = /don't\(\)/g;

function* parseMulWithDoAndDont(lines: string[]): Generator<[number, number]> {
  let active = true;

  for (const line of lines) {
    const matches = [...line.matchAll(mulRegex)].map<ParsedCommand>((m) => ({
      type: "mul",
      a: Number(m[1]),
      b: Number(m[2]),
      index: m.index,
    }));

    const doMatches = [...line.matchAll(doRegex)].map<ParsedCommand>((m) => ({
      type: "do",
      index: m.index,
    }));

    const dontMatches = [...line.matchAll(dontRegex)].map<ParsedCommand>(
      (m) => ({
        type: "dont",
        index: m.index,
      })
    );

    const commands = [...matches, ...doMatches, ...dontMatches].sort(
      (a, b) => a.index - b.index
    );

    for (const command of commands) {
      if (active && command.type === "mul") {
        yield [command.a, command.b];
      }

      active = (active && command.type !== "dont") || command.type === "do";
    }
  }
}

function* evalMul(gen: Generator<[number, number]>): Generator<number> {
  for (const [a, b] of gen) {
    yield a * b;
  }
}

function sum(gen: Generator<number>): number {
  let acc = 0;
  for (const n of gen) {
    acc += n;
  }
  return acc;
}
