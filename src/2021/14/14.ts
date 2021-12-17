import { curry, last, pipe, range } from "ramda";

interface Insertion {
  pair: string;
  insert: string;
}

type Template = readonly string[];

type Pair = readonly string[];

type ElementsCount = { [element: string]: number };

export function extendedPolymerization(data: string) {
  const [template, insertions] = loadData(data);
  const curriedFilledPairs = curry(fillPairs)(insertions);

  const polymerization = pipe(explode, curriedFilledPairs, merge);
  const polymerizedTemplate = range(0, 10).reduce(
    (p, _) => polymerization(p),
    template
  );

  const countAndGetResult = pipe(count, result);

  console.log(countAndGetResult(polymerizedTemplate));
}

function display(template: Template): Template {
  const reduced = template.reduce((c, p) => c + p, "");
  console.log(reduced);
  return template;
}

function explode(template: Template): Pair[] {
  return template
    .slice(0, template.length - 1)
    .reduce((p: Pair[], _, i) => p.concat([template.slice(i, i + 2)]), []);
}

function merge(pairs: Pair[]): Template {
  return pairs
    .reduce((p: Template, c) => p.concat(c.slice(0, c.length - 1)), [])
    .concat(last(last(pairs)!)!);
}

function fillPairs(insertions: Insertion[], pairs: Pair[]): Pair[] {
  return pairs.map((p) => fillPair(insertions, p));
}

const fillPair = (insertions: Insertion[], pair: Pair): Pair => {
  const insertion = insertions.find((i) => i.pair == pair[0] + pair[1]);
  return insertion != undefined ? [pair[0], insertion.insert, pair[1]] : pair;
};

function count(template: Template): ElementsCount {
  return template.reduce((p: ElementsCount, c) => {
    p[c] = p[c] == undefined ? 1 : p[c] + 1;
    return p;
  }, {});
}

function result(count: ElementsCount): number {
  const sorted = Object.values(count).sort((a, b) => a - b);
  return sorted[sorted.length - 1] - sorted[0];
}

function loadData(data: string): [Template, Insertion[]] {
  const split = data.split("\n");
  const template = split[0].split("");
  const insertions = split.slice(2).map((i) => {
    const s = i.split(" -> ");
    return { pair: s[0], insert: s[1] };
  });

  return [template, insertions];
}
