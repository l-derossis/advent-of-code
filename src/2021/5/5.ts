interface VentLine {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

class Floor {
  private grid: number[][] = [];

  constructor(dimension: number) {
    for (let i = 0; i < dimension; ++i) {
      this.grid.push([]);
      for (let j = 0; j < dimension; ++j) {
        this.grid[i].push(0);
      }
    }
  }

  addVentLine(line: VentLine, useDiagonals: boolean) {
    if (line.x1 == line.x2) {
      const origin = line.y1 < line.y2 ? line.y1 : line.y2;
      const end = line.y1 > line.y2 ? line.y1 : line.y2;
      for (let i = origin; i <= end; ++i) {
        this.grid[i][line.x1]++;
      }
    } else if (line.y1 == line.y2) {
      const origin = line.x1 < line.x2 ? line.x1 : line.x2;
      const end = line.x1 > line.x2 ? line.x1 : line.x2;
      for (let i = origin; i <= end; ++i) {
        this.grid[line.y1][i]++;
      }
    } else if (useDiagonals) {
      const distance = Math.abs(line.x1 - line.x2);
      const right = line.x2 - line.x1 > 0;
      const down = line.y2 - line.y1 > 0;

      for (let i = 0; i <= distance; ++i) {
        this.grid[down ? line.y1 + i : line.y1 - i][
          right ? line.x1 + i : line.x1 - i
        ]++;
      }
    }
  }

  dangerCount(): number {
    return this.grid.reduce(
      (p, c) => p + c.reduce((pr, cu) => pr + (cu > 1 ? 1 : 0), 0),
      0
    );
  }
}

export function hydrothermalVents(data: string) {
  const lines = parseLines(data);

  console.log(
    `[2021, 5-1] Danger zones count (no diagonal vents): ${getDangerCount(
      lines,
      false
    )}`
  );

  console.log(
    `[2021, 5-2] Danger zones count (diagonal vents): ${getDangerCount(
      lines,
      true
    )}`
  );
}

function getDangerCount(lines: VentLine[], includeDiagonals: boolean): number {
  const floor = new Floor(1000);
  lines.forEach((l) => floor.addVentLine(l, includeDiagonals));
  return floor.dangerCount();
}

function parseLines(data: string): VentLine[] {
  const rows = data.split("\n");

  return rows.map((r) => {
    const values = r.replace(" -> ", ",").split(",");
    return {
      x1: +values[0],
      y1: +values[1],
      x2: +values[2],
      y2: +values[3],
    };
  });
}
