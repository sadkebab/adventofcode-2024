export function regexMatchCount(regex: RegExp, ...values: string[]): number {
  return values.reduce((acc, line) => {
    return acc + Array.from(line.matchAll(regex)).length;
  }, 0);
}
