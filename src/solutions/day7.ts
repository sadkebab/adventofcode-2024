export function solution(lines: string[]) {
  lines = lines.filter((line) => line.length > 0);
  const rules = lines.map((line) => {
    const [output, input] = line.split(": ");

    return {
      output: Number(output),
      input: input.split(" ").map(Number),
    };
  });

  return [calibrationRules(rules, match), calibrationRules(rules, matchConcat)];
}

function calibrationRules(
  rules: { input: number[]; output: number }[],
  matchFn: (output: number, acc: number, ...input: number[]) => boolean
) {
  const matching = rules.filter((rule) =>
    matchFn(rule.output, rule.input[0], ...rule.input.slice(1))
  );

  return matching.reduce((acc, rule) => acc + rule.output, 0);
}

function match(output: number, acc: number, ...input: number[]): boolean {
  if (input.length == 0) {
    return output == acc;
  }

  return (
    match(output, acc + input[0], ...input.slice(1)) ||
    match(output, acc * input[0], ...input.slice(1))
  );
}

function matchConcat(output: number, acc: number, ...input: number[]): boolean {
  if (input.length == 0) {
    return output == acc;
  }

  return (
    matchConcat(output, acc + input[0], ...input.slice(1)) ||
    matchConcat(output, acc * input[0], ...input.slice(1)) ||
    matchConcat(output, parseInt(`${acc}${input[0]}`), ...input.slice(1))
  );
}
