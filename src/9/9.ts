type Basin = Point[];

interface Point {
  x: number;
  y: number;
  height: number;
}
interface Neighbors {
  origin: Point;
  neighbor: Point;
}

class HeightMap {
  private readonly map: number[][] = [];

  get basins(): Basin[] {
    const lowestPoints = this.lowestPoints;
    return lowestPoints.map((lp) => this.buildBasinFromLowestPoint(lp));
  }

  get lowestPoints(): Point[] {
    const lowPoints: Point[] = [];
    for (let x = 0; x < this.map[0].length; ++x) {
      for (let y = 0; y < this.map.length; ++y) {
        const neighbors = this.neighbors(this.pointAt(x, y));
        if (neighbors.every((n) => n.neighbor.height > n.origin.height)) {
          lowPoints.push(this.pointAt(x, y));
        }
      }
    }

    return lowPoints;
  }

  private buildBasinFromLowestPoint(point: Point): Basin {
    const basin: Basin = [point];

    let neighbors: Neighbors[] = [];
    do {
      neighbors = this.basinNeighbors(basin);
    } while (this.mergeNeighorsIntoBasin(basin, neighbors) > 0);

    return basin;
  }

  private mergeNeighorsIntoBasin(basin: Basin, neighbors: Neighbors[]): number {
    let mergeCount = 0;
    neighbors.forEach((n) => {
      if (this.isNeighborMergeableIntoBasin(basin, n)) {
        basin.push(n.neighbor);
        ++mergeCount;
      }
    });

    return mergeCount;
  }

  private pointAt(x: number, y: number): Point {
    return {
      x: x,
      y: y,
      height: this.map[y][x],
    };
  }

  private neighbors(point: Point): Neighbors[] {
    const neighbors: Point[] = [];
    if (point.y > 0) neighbors.push(this.pointAt(point.x, point.y - 1));
    if (point.x > 0) neighbors.push(this.pointAt(point.x - 1, point.y));
    if (point.x < this.map[point.y].length - 1)
      neighbors.push(this.pointAt(point.x + 1, point.y));
    if (point.y < this.map.length - 1)
      neighbors.push(this.pointAt(point.x, point.y + 1));
    return neighbors.map((n) => {
      return { origin: point, neighbor: n };
    });
  }

  private basinNeighbors(basin: Basin): Neighbors[] {
    const basinNeighbors: Neighbors[] = [];

    basin.forEach((point) => {
      basinNeighbors.push(
        ...this.neighbors(point).filter(
          (neighbor) => !this.basinIncludesPoint(basin, neighbor.neighbor)
        )
      );
    });

    return basinNeighbors;
  }

  private isNeighborMergeableIntoBasin(
    basin: Basin,
    neighbor: Neighbors
  ): boolean {
    return (
      !this.basinIncludesPoint(basin, neighbor.neighbor) &&
      this.basinIncludesPoint(basin, neighbor.origin) &&
      neighbor.neighbor.height > neighbor.origin.height &&
      neighbor.neighbor.height < 9
    );
  }

  private basinIncludesPoint(basin: Basin, point: Point): boolean {
    return basin.find((p) => p.x == point.x && p.y == point.y) != undefined;
  }

  constructor(map: number[][]) {
    this.map = map;
  }
}

export function lavaTubes(data: string) {
  const map = new HeightMap(data.split("\n").map((l) => [...l].map((c) => +c)));
  const sum = map.lowestPoints.reduce((p, c) => p + c.height + 1, 0);
  console.log(`Sum of lowest points: ${sum}`);

  const threeLargestBasinsSize = map.basins
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)
    .reduce((p, c) => p * c.length, 1);
  console.log(`Multiplied size of 3 largest basins: ${threeLargestBasinsSize}`);
}
