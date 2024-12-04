export function verticalLines(matrix: string[][]): string[] {
  const data: string[] = [];

  while (matrix[0].length > 0) {
    const line: string[] = [];

    for (let i = 0; i < matrix.length; i++) {
      const value = matrix[i].shift();
      if (value) {
        line.push(value);
      } else {
        return data;
      }
    }
    data.push(line.join(""));
  }

  return data;
}

export function obliqueLines(
  matrix: string[][],
  opts: { inverse?: boolean } = {}
): string[] {
  const { inverse = false } = opts;
  const data: string[] = [];

  while (matrix.length > 0) {
    const result: string[] = [];
    const pos = inverse ? matrix.length - 1 : 0;

    if (matrix[pos].length === 0) {
      matrix.splice(pos, 1);
    }

    if (matrix.length === 0) {
      break;
    }

    for (let i = 0; i < matrix.length; i++) {
      const pos = inverse ? matrix.length - 1 - i : i;
      result.push(matrix[i][pos]);
      matrix[i].splice(pos, 1);
    }
    data.push(result.join(""));
  }

  return data;
}
