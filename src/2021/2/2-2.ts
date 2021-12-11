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
  aim: number;
}

export function submarinePositionWithAim(data: string) {
  const result = data
    .split("\n")
    .map((l) => parseCommand(l))
    .reduce(applyCommand, { horizontal: 0, vertical: 0, aim: 0 });
  console.log(`[2021, 2-2] Product: ${result.horizontal * result.vertical}`);
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

let applyCommand = (position: Position, command: Command): Position => {
  switch (command.direction) {
    case Direction.Forward:
      return {
        aim: position.aim,
        horizontal: position.horizontal + command.units,
        vertical: position.vertical + command.units * position.aim,
      };
    case Direction.Up:
      return { ...position, aim: position.aim - command.units };
    case Direction.Down:
      return { ...position, aim: position.aim + command.units };
  }
};
