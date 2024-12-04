import { obliqueLines } from "../lib/matrices";
import { verticalLines } from "../lib/matrices";
import { regexMatchCount } from "../lib/regex";

export function solution(lines: string[]): [number, number] {
  return [findXMASLiterals(lines), findXShapedMASLiterals(lines)];
}

function toMatrix(lines: string[]): string[][] {
  return lines.map((line) => line.split(""));
}

function findXMASLiterals(lines: string[]): number {
  const vertical = verticalLines(toMatrix(lines));
  const obliqueStart = obliqueLines(toMatrix(lines));
  const obliqueEnd = obliqueLines(toMatrix(lines), { inverse: true });

  return [/XMAS/g, /SAMX/g].reduce((acc, regex) => {
    return (
      acc +
      regexMatchCount(
        regex,
        ...lines,
        ...vertical,
        ...obliqueStart,
        ...obliqueEnd
      )
    );
  }, 0);
}

type VisitorFunction = (matrix: string[][], x: number, y: number) => boolean;

function findXShapedMASLiterals(lines: string[]): number {
  const matrix = toMatrix(lines);

  const solutions: Record<string, VisitorFunction> = {
    M: (matrix, x, y) => {
      if (matrix[x + 2] === undefined || matrix[x][y + 2] === undefined) {
        return false;
      }

      if (matrix[x + 1][y + 1] === "A" && matrix[x + 2][y + 2] === "S") {
        if (matrix[x][y + 2] === "M" && matrix[x + 2][y] === "S") {
          return true;
        }
        if (matrix[x][y + 2] === "S" && matrix[x + 2][y] === "M") {
          return true;
        }
      }

      return false;
    },
    S: (matrix, x, y) => {
      if (matrix[x + 2] === undefined || matrix[x][y + 2] === undefined) {
        return false;
      }

      if (matrix[x + 1][y + 1] === "A" && matrix[x + 2][y + 2] === "M") {
        if (matrix[x][y + 2] === "M" && matrix[x + 2][y] === "S") {
          return true;
        }
        if (matrix[x][y + 2] === "S" && matrix[x + 2][y] === "M") {
          return true;
        }
      }
      return false;
    },
  };

  return matrix.reduce((acc, line, x) => {
    return (
      acc +
      line.reduce((acc, char, y) => {
        return acc + (solutions[char]?.(matrix, x, y) ? 1 : 0);
      }, 0)
    );
  }, 0);
}
