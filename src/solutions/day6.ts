type Direction = "^" | "v" | "<" | ">";
export function solution(lines: string[]): [number, number] {
  const matrix = lines.map((line) => line.split(""));

  const { startingPosition, startingDirection } = matrix.reduce(
    (acc, line, idx) => {
      line.forEach((char, jdx) => {
        if (char === "^" || char === "v" || char === "<" || char === ">") {
          acc.startingPosition = [idx, jdx];
          acc.startingDirection = char;
        }
      });

      return acc;
    },
    {
      startingPosition: [-1, -1] as [number, number],
      startingDirection: "^" as Direction,
    }
  );

  const visited = visitedNodes(matrix, startingPosition, startingDirection);

  return [
    visited.length,
    loopOptions(visited, matrix, startingPosition, startingDirection),
  ];
}

const obstacles = new Set<string>(["#", "O"]);

function visitedNodes(
  matrix: string[][],
  startingPosition: [number, number],
  startingDirection: Direction
) {
  let position = startingPosition;
  let direction = startingDirection;

  const visited = new Set<string>();

  while (
    position[0] > 0 &&
    position[1] > 0 &&
    position[0] < matrix.length - 1 &&
    position[1] < matrix[0].length - 1
  ) {
    visited.add(position.join(","));
    switch (direction) {
      case "^":
        if (obstacles.has(matrix[position[0] - 1][position[1]])) {
          direction = ">";
        } else {
          position = [position[0] - 1, position[1]];
        }
        break;
      case "v":
        if (obstacles.has(matrix[position[0] + 1][position[1]])) {
          direction = "<";
        } else {
          position = [position[0] + 1, position[1]];
        }
        break;
      case "<":
        if (obstacles.has(matrix[position[0]][position[1] - 1])) {
          direction = "^";
        } else {
          position = [position[0], position[1] - 1];
        }
        break;
      case ">":
        if (obstacles.has(matrix[position[0]][position[1] + 1])) {
          direction = "v";
        } else {
          position = [position[0], position[1] + 1];
        }
        break;
    }
  }
  visited.add(position.join(","));

  return Array.from(visited.values()).map(
    (s) => s.split(",").map(Number) as [number, number]
  );
}

function loopOptions(
  visited: [number, number][],
  matrix: string[][],
  startingPosition: [number, number],
  startingDirection: Direction
) {
  const loops = visited.reduce((acc, coord, idx) => {
    if (coord[0] === startingPosition[0] && coord[1] === startingPosition[1]) {
      return acc;
    }

    matrix[coord[0]][coord[1]] = "O";

    let position = startingPosition;
    let direction = startingDirection;

    const visited = new Set<string>();

    while (
      position[0] > 0 &&
      position[1] > 0 &&
      position[0] < matrix.length - 1 &&
      position[1] < matrix[0].length - 1
    ) {
      const current = `${position.join(",")}:${direction}`;
      if (visited.has(current)) {
        matrix[coord[0]][coord[1]] = ".";
        return acc + 1;
      }

      visited.add(current);

      switch (direction) {
        case "^":
          if (obstacles.has(matrix[position[0] - 1][position[1]])) {
            direction = ">";
          } else {
            position = [position[0] - 1, position[1]];
          }
          break;
        case "v":
          if (obstacles.has(matrix[position[0] + 1][position[1]])) {
            direction = "<";
          } else {
            position = [position[0] + 1, position[1]];
          }
          break;
        case "<":
          if (obstacles.has(matrix[position[0]][position[1] - 1])) {
            direction = "^";
          } else {
            position = [position[0], position[1] - 1];
          }
          break;
        case ">":
          if (obstacles.has(matrix[position[0]][position[1] + 1])) {
            direction = "v";
          } else {
            position = [position[0], position[1] + 1];
          }
          break;
      }
    }

    matrix[coord[0]][coord[1]] = ".";
    return acc;
  }, 0);

  return loops;
}
