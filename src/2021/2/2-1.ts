enum Direction {
  Forward,
  Up,
  Down,
}

interface Command {
  direction: Direction;
  units: number;
}

interface Position {
  horizontal: number;
  vertical: number;
}

export function submarinePosition(data: string) {
  const result = data
    .split("\n")
    .map((l) => parseCommand(l))
    .reduce(move, { horizontal: 0, vertical: 0 });
  console.log(`[2021, 2-1] Product: ${result.horizontal * result.vertical}`);
}

let parseCommand = (line: string): Command => {
  const mapper: { [input: string]: Direction } = {
    forward: Direction.Forward,
    up: Direction.Up,
    down: Direction.Down,
  };

  const values = line.split(" ");

  return {
    direction: mapper[values[0]],
    units: +values[1],
  };
};

let move = (position: Position, command: Command): Position => {
  switch (command.direction) {
    case Direction.Forward:
      return { ...position, horizontal: position.horizontal + command.units };
    case Direction.Up:
      return { ...position, vertical: position.vertical - command.units };
    case Direction.Down:
      return { ...position, vertical: position.vertical + command.units };
  }
};
