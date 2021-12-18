import { curry, last, pipe, range } from "ramda";

type Element = string;

type Template = string;

type Pair = string;

interface Insertion {
  pair: Pair;
  insert: Element;
}

type PairRegistry = { [pair: Pair]: number };

type ElementsCount = { [element: string]: number };

export function extendedPolymerization(data: string) {
  const [template, insertions] = loadData(data);

  const getResult = (limit: number) => {
    const pairs = explode(template);
    const polymerizedPairs = range(0, limit).reduce(
      (p: PairRegistry, _) => fillPairs(insertions, p),
      pairs
    );

    return result(countElements(polymerizedPairs, template));
  };

  console.log(`[2021, 14-01] Result after 10 steps is ${getResult(10)}`);
  console.log(`[2021, 14-02] Result after 40 steps is ${getResult(40)}`);
}

function explode(template: Template): PairRegistry {
  return template
    .substring(0, template.length - 1)
    .split("")
    .reduce((p, _, i) => registerPair(extractPair(template, i), 1, p), {});
}

const extractPair = (template: Template, index: number): Pair => {
  return template.slice(index, index + 2);
};

const registerPair = (
  pair: Pair,
  count: number,
  registry: PairRegistry
): PairRegistry => {
  registry[pair] = registry[pair] == undefined ? count : registry[pair] + count;
  return registry;
};

const unregisterPair = (
  pair: Pair,
  count: number,
  registry: PairRegistry
): PairRegistry => {
  registry[pair] -= count;
  return registry;
};

function fillPairs(insertions: Insertion[], count: PairRegistry): PairRegistry {
  const cInsert = curry(insert)(insertions, count);
  return Object.keys(count).reduce(cInsert, { ...count });
}

const insert = (
  insertions: Insertion[],
  initialRegistry: PairRegistry,
  currentRegistry: PairRegistry,
  pair: Pair
): PairRegistry => {
  const insertion = insertions.find((i) => i.pair == pair);
  if (insertion == undefined) return currentRegistry;

  const newPairs = [
    insertion.pair[0] + insertion.insert,
    insertion.insert + insertion.pair[1],
  ];

  const cUnregisterPair = curry(unregisterPair)(
    insertion.pair,
    initialRegistry[pair]
  );
  return pipe(
    curry(registerPair)(newPairs[0], initialRegistry[pair]),
    curry(registerPair)(newPairs[1], initialRegistry[pair]),
    cUnregisterPair
  )(currentRegistry);
};

function countElements(
  count: PairRegistry,
  initialTemplate: Template
): ElementsCount {
  const c = Object.keys(count)
    .filter((p) => count[p] > 0)
    .reduce((p: ElementsCount, c) => {
      p[c[0]] = p[c[0]] == undefined ? count[c] : p[c[0]] + count[c];
      return p;
    }, {});

  c[last(initialTemplate)]++;
  return c;
}

function result(count: ElementsCount): number {
  const sorted = Object.values(count).sort((a, b) => a - b);
  return sorted[sorted.length - 1] - sorted[0];
}

function loadData(data: string): [Template, Insertion[]] {
  const split = data.split("\n");
  const template = split[0];
  const insertions: Insertion[] = split.slice(2).map((i) => {
    const s = i.split(" -> ");
    return { pair: s[0], insert: s[1] };
  });

  return [template, insertions];
}
