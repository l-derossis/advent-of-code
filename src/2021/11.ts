interface Coordinates {
  x: number;
  y: number;
}

class OctopusMap {
  private map: number[][];

  constructor(map: number[][]) {
    this.map = map;
  }

  runSteps(count: number) {
    let flashes = 0;
    for (let i = 0; i < count; ++i) {
      flashes += this.step();
    }

    return flashes;
  }

  step(): number {
    this.flashedThisStep = [];
    this.foreach((c) => this.increase(c));
    this.solveFlashes();
    return this.flashedThisStep.length;
  }

  private foreach(callback: (coordinates: Coordinates) => void) {
    for (let y = 0; y < this.map.length; ++y) {
      for (let x = 0; x < this.map[0].length; ++x) {
        callback({ x: x, y: y });
      }
    }
  }

  private solveFlashes() {
    let keepFlashing = false;

    do {
      keepFlashing = false;
      this.foreach((c) => {
        if (this.canFlash(c)) {
          this.flash(c);
          keepFlashing = true;
        }
      });
    } while (keepFlashing);
  }

  private at(position: Coordinates): number {
    return this.map[position.y][position.x];
  }

  private increase(position: Coordinates) {
    this.map[position.y][position.x] = (this.at(position) + 1) % 10;
  }

  flashedThisStep: Coordinates[] = [];

  private flash(position: Coordinates) {
    if (this.canFlash(position)) {
      this.flashedThisStep.push(position);
      const neighbors = this.neighbors(position);
      neighbors.forEach((n) => {
        if (this.at(n) > 0) {
          this.increase(n);
        }
      });
    }
  }

  private canFlash(position: Coordinates) {
    return (
      !this.flashedThisStep.find(
        (f) => f.x == position.x && f.y == position.y
      ) && this.at(position) == 0
    );
  }

  neighbors(c: Coordinates): Coordinates[] {
    const res: Coordinates[] = [];

    if (c.y > 0) res.push({ x: c.x, y: c.y - 1 }); // Top
    if (c.x < this.map[0].length - 1) res.push({ x: c.x + 1, y: c.y }); // Right
    if (c.y < this.map.length - 1) res.push({ x: c.x, y: c.y + 1 }); // Bottom
    if (c.x > 0) res.push({ x: c.x - 1, y: c.y }); // Left
    if (c.x > 0 && c.y > 0) res.push({ x: c.x - 1, y: c.y - 1 }); // Top left
    if (c.x > 0 && c.y < this.map.length - 1)
      res.push({ x: c.x - 1, y: c.y + 1 }); // Bottom left
    if (c.x < this.map[0].length - 1 && c.y > 0)
      res.push({ x: c.x + 1, y: c.y - 1 }); // Top right
    if (c.x < this.map[0].length - 1 && c.y < this.map.length - 1)
      res.push({ x: c.x + 1, y: c.y + 1 }); // Bottom right

    return res;
  }
}

export function dumboOctopus(data: string) {
  let map = new OctopusMap(loadData(data));
  const count = 100;
  console.log(
    `[2021, 11-1] Flashes after ${count} steps: ${map.runSteps(100)}`
  );

  map = new OctopusMap(loadData(data));
  let i = 0;
  do {
    ++i;
  } while (map.step() != 100);
  console.log(
    `[2021, 11-2] Step at which all octopuses flash simultaneously: ${i}`
  );
}

function loadData(data: string): number[][] {
  return data.split("\n").map((line) => [...line].map((octopus) => +octopus));
}
