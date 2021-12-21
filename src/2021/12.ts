import { curry, ifElse, map, pipe } from "ramda";

export function passagePathing(data: string) {
  const caves = data.split("\n").reduce(reducer, []);
  const start = caves[caves.findIndex((c) => c.name == "start")];

  console.log(
    `[2021, 12-1] Different pathes count: ${possiblePaths(start, caves).length}`
  );

  const pathsWithRevisits = caves
    .filter((c) => !c.big && !["start", "end"].includes(c.name))
    .reduce((p: string[], c) => p.concat(possiblePaths(start, caves, c)), [])
    .reduce((p, c) => p.add(c), new Set<string>()); // Remove duplicates

  console.log(
    `[2021, 12-1] Possibles paths with revisit: ${pathsWithRevisits.size}`
  );
}

class Cave {
  readonly name: string;
  readonly neighbors: readonly Cave[];

  get big(): boolean {
    return this.name.toUpperCase() == this.name;
  }

  withNeighbors(neighbors: Cave[]): Cave {
    return new Cave(this.name, this.neighbors.concat([...neighbors]));
  }

  constructor(name: string, neighbors: Cave[] = []) {
    this.name = name;
    this.neighbors = neighbors;
  }
}

function possiblePaths(
  cave: Cave,
  caveMap: readonly Cave[],
  revisitableCave: Cave | undefined = undefined,
  path = ""
): string[] {
  const visitableNeighbors = getNeighborsFromMap(cave, caveMap).filter((n) =>
    visitable(n, path, revisitableCave)
  );

  const terminalCondition = (): boolean => cave.name == "end";

  const buildPath = (): string[] =>
    visitableNeighbors.reduce(
      (p: string[], c) =>
        p.concat(
          possiblePaths(c, caveMap, revisitableCave, `${path},${cave.name}`)
        ),
      []
    );

  return ifElse(
    () => terminalCondition(),
    () => [`${path},${cave.name}`],
    () => buildPath()
  )();
}

const visitable = (
  cave: Cave,
  path: string,
  revisitableCave: Cave | undefined = undefined
): boolean => {
  return (
    cave.big ||
    path.split(",").filter((name) => name == cave.name).length <
      (revisitableCave?.name == cave.name ? 2 : 1)
  );
};

const getNeighborsFromMap = (cave: Cave, caveMap: readonly Cave[]): Cave[] => {
  return caveMap.filter((c) => c.neighbors.some((n) => n.name == cave.name));
};

function reducer(caves: readonly Cave[], line: string): Cave[] {
  const getCaveNames = (line: string): string[] => {
    return line.split("-");
  };

  const getCave = curry((c: readonly Cave[], name: string): Cave => {
    const found = c.find((i) => i.name == name);
    return found != undefined ? found : new Cave(name);
  });

  const linkTwoCaves = (c: readonly Cave[]): Cave[] => {
    return [c[0].withNeighbors([c[1]]), c[1].withNeighbors([c[0]])];
  };

  const lineCaves = pipe(getCaveNames, map(getCave(caves)), linkTwoCaves)(line);

  return caves.filter((c) => isIn(c, lineCaves)).concat(lineCaves);
}

function isIn(cave: Cave, caves: readonly Cave[]): boolean {
  return caves.every((c) => c.name != cave.name);
}
