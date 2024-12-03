import { partition } from "lodash";

type JoinIteratorData<T> = {
  gen: Generator<T>;
  next: IteratorResult<T, any>;
};

/**
 * Joins multiple iterators into a single iterator that yields values in order, sorted by a compare function on the next values for every iterator.
 *
 * @param compare - A function that compares two values and returns a number.
 * @param iters - The iterators to join.
 */
export function* joinIterators<T>(
  compare: (a: T, b: T) => number,
  ...iters: Generator<T>[]
): Generator<T> {
  let pulledGen: Generator<T> | undefined = undefined;

  let firstPull = iters.map<JoinIteratorData<T>>((iter) => ({
    gen: iter,
    next: iter.next(),
  }));

  let values: JoinIteratorData<T>[] = [];

  while (true) {
    if (pulledGen !== undefined) {
      values.push({
        gen: pulledGen,
        next: pulledGen.next(),
      });
    } else {
      values.push(...firstPull);
    }

    const [newValues, done] = partition(values, (x) => !x.next.done);
    iters = iters.filter((i) => !done.map((x) => x.gen).includes(i));
    values = newValues.sort((a, b) => compare(a.next.value, b.next.value));

    if (values.length === 0) break;

    const lower = values[0];
    pulledGen = lower.gen;
    values = values.slice(1);

    yield lower.next.value;
  }
  return;
}
