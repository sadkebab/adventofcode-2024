import { joinIterators } from "../lib/iterators";

export function solution(lines: string[]): [number, number] {
  return [
    sum(evalMul(parseMul(lines))),
    sum(evalMul(parseMulWithDoAndDont(lines))),
  ];
}

const mulRegex = /mul\((\d+),(\d+)\)/g;
const doRegex = /do\(\)/g;
const dontRegex = /don't\(\)/g;

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

function* parseMul(lines: string[]): Generator<[number, number]> {
  for (const line of lines) {
    const matches = line.matchAll(mulRegex);

    for (const match of matches) {
      const [left, right] = match.slice(1).map(Number);
      yield [Number(left), Number(right)];
    }
  }
}

type ParsedCommand =
  | {
      type: "mul";
      params: [number, number];
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

function* parseMulWithDoAndDont(lines: string[]): Generator<[number, number]> {
  let active = true;

  const toMul: (match: RegExpExecArray) => ParsedCommand = (match) => ({
    type: "mul",
    params: [Number(match[1]), Number(match[2])],
    index: match.index,
  });

  const toDo: (match: RegExpExecArray) => ParsedCommand = (match) => ({
    type: "do",
    index: match.index,
  });

  const toDont: (match: RegExpExecArray) => ParsedCommand = (match) => ({
    type: "dont",
    index: match.index,
  });

  for (const line of lines) {
    const iterator = joinIterators(
      (a, b) => a.index - b.index,
      matchWrapper(line, mulRegex, toMul),
      matchWrapper(line, doRegex, toDo),
      matchWrapper(line, dontRegex, toDont)
    );

    for (const event of iterator) {
      if (active && event.type === "mul") {
        yield event.params;
      }

      active = (active && event.type !== "dont") || event.type === "do";
    }
  }
}

function* matchWrapper<T>(
  input: string,
  regex: RegExp,
  wrapFn: (match: RegExpExecArray) => T
): Generator<T> {
  const matches = input.matchAll(regex);

  for (const match of matches) {
    yield wrapFn(match);
  }
}
