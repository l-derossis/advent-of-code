interface PathPoint {
  x: number;
  y: number;
  risk: number;
  totalRisk: number;
  previous?: PathPoint;
}

type Map = readonly PathPoint[];

export function chiton(data: string) {
  const unvisited = loadData(data);

  console.log(
    `[2021, 15-01] Lowest risk path: ${shortestPath(unvisited, false)}`
  );

  console.log(
    `[2021, 15-02] Lowest risk path (full map): ${shortestPath(
      unvisited,
      true
    )}`
  );
}

const shortestPath = (map: Map, expandedMap: boolean): number => {
  if (expandedMap) {
    map = expandMap(map);
  }

  const start = startingPoint(map);
  let end = endingPoint(map);

  map = updateMap(map, [{ ...start, totalRisk: 0 }]);

  const mapWithDistances = dijsktraOptimized([], map, start, end);
  end = endingPoint(mapWithDistances);

  return end.totalRisk;
};

const startingPoint = (map: Map): PathPoint => {
  return map.find((p) => p.x == 0 && p.y == 0)!;
};

const endingPoint = (map: Map): PathPoint => {
  return map.reduce((p, c) => (c.x >= p.x && c.y >= p.y ? c : p), map[0]);
};

// As of now, Node does not support TCO / PTC, so we can't use recursivity here
// without getting a max call stack error
const dijsktraOptimized = (
  visited: Map,
  unvisited: Map,
  current: PathPoint,
  target: PathPoint
): Map => {
  let currentLimit = 10;
  // This is an optimization, we only load points that migth be reachable in the next iteration.
  // Dijsktra's algorithm requires going through all unvisited points at every loop, so by reducing
  // the number of unvisited points, we can go much faster.
  // Since we know we are going from top left to bottom right, the idea is to load a square of points
  // that gradually growths when the visited points are close to its borders.
  // The data structured used here (an array of poitns) is probably utterly unefficient to solve this issue,
  // so even with this optimization it's still very slow for the complete map that includes 250 000 points.
  let [currentUnvisited, remainingUnvisited] = limitMapSize(
    unvisited,
    currentLimit
  );

  let found = false;
  while (!found) {
    const unvisitedNeighbors = neighbors(current, currentUnvisited).sort(
      (a, b) => a.risk - b.risk
    );
    const updatedNeighbors = updateDistances(unvisitedNeighbors, current);
    const updatedMap = updateMap(currentUnvisited, updatedNeighbors);
    [currentUnvisited, current] = extractNextPoint(updatedMap);
    visited = visited.concat(current);

    if (current.x == target.x && current.y == target.y) {
      found = true;
    }

    if (current.x == currentLimit - 2 || current.y == currentLimit - 2) {
      currentLimit += 3;
      const [additionalUnvisited, tmpRemainingUnvisited] = limitMapSize(
        remainingUnvisited,
        currentLimit
      );
      currentUnvisited = currentUnvisited.concat(additionalUnvisited);
      remainingUnvisited = tmpRemainingUnvisited;
    }
  }

  return visited;
};

const limitMapSize = (map: Map, limit: number): [Map, Map] => {
  return [
    map.filter((p) => p.x < limit && p.y < limit),
    map.filter((p) => p.x >= limit || p.y >= limit),
  ];
};

const extractNextPoint = (map: Map): [Map, PathPoint] => {
  const lowestRisk = map.reduce(
    (p, c, i) => {
      return c.totalRisk < p.lowestRiskPoint.totalRisk
        ? {
            lowestRiskPoint: c,
            index: i,
          }
        : p;
    },
    {
      lowestRiskPoint: map[0],
      index: 0,
    }
  );

  return [
    map.slice(0, lowestRisk.index).concat(map.slice(lowestRisk.index + 1)),
    lowestRisk.lowestRiskPoint,
  ];
};

const updateMap = (map: Map, points: PathPoint[]): Map => {
  const copy = [...map];

  while (points.length > 0) {
    const next = points.shift();
    const matchIndex = copy.findIndex((p) => p.x == next?.x && p.y == next.y);
    copy[matchIndex] = next!;
  }

  return copy;
};

const neighbors = (p: PathPoint, unvisited: Map): PathPoint[] => {
  return [
    at(p.x - 1, p.y, unvisited),
    at(p.x, p.y - 1, unvisited),
    at(p.x + 1, p.y, unvisited),
    at(p.x, p.y + 1, unvisited),
  ].filter((p: PathPoint | undefined): p is PathPoint => {
    return !!p;
  });
};

const at = (x: number, y: number, map: Map): PathPoint | undefined => {
  return map.find((p) => p.x == x && p.y == y);
};

const updateDistances = (
  neighbors: PathPoint[],
  current: PathPoint
): PathPoint[] => {
  return neighbors.map((n) => {
    const pathTotalRisk = current.totalRisk + n.risk;
    const shorter = pathTotalRisk < n.totalRisk;
    return {
      ...n,
      totalRisk: shorter ? pathTotalRisk : n.totalRisk,
      previous: shorter ? current : n.previous,
    };
  });
};

const expandMap = (map: Map): Map => {
  const tiles: Map[][] = [];

  tiles.push([]);
  tiles[0].push([...map]);
  for (let x = 1; x < 5; x++) {
    tiles[0].push(generateMapTile(tiles[0][x - 1], 1, 0));
  }

  for (let y = 1; y < 5; ++y) {
    tiles.push([]);
    for (let x = 0; x < 5; ++x) {
      tiles[y].push(generateMapTile(tiles[y - 1][x], 0, 1));
    }
  }

  const expanded: PathPoint[] = [];

  for (let y = 0; y < 5; ++y) {
    for (let x = 0; x < 5; ++x) {
      expanded.push(...tiles[y][x]);
    }
  }

  return expanded;
};

const generateMapTile = (map: Map, xOffset: number, yOffset: number): Map => {
  return map.map((p) => {
    const riskOffset = (p.risk + xOffset + yOffset) % 10;
    return {
      risk: riskOffset == 0 ? 1 : riskOffset,
      totalRisk: Number.MAX_SAFE_INTEGER,
      x: p.x + xOffset * Math.sqrt(map.length),
      y: p.y + yOffset * Math.sqrt(map.length),
    };
  });
};

function loadData(data: string): Map {
  return data.split("\n").reduce((p: Map, c, i) => p.concat(mapLine(c, i)), []);
}

const mapLine = (line: string, yIndex: number): PathPoint[] => {
  return line.split("").reduce(
    (p: PathPoint[], c, xIndex) =>
      p.concat([
        {
          x: +xIndex,
          y: yIndex,
          risk: +c,
          totalRisk: Number.MAX_SAFE_INTEGER,
        },
      ]),
    []
  );
};
