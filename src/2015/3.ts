import { always, concat, cond, curry, equals, length, pipe } from "ramda";

interface Position {
  x: number;
  y: number;
}

export function perfectlySphericalHousesInAVacuum(data: string) {
  const instructions = data.split("");
  const initialPosition = { x: 0, y: 0 };
  const curriedFollowInstructions = curry(followInstructions)(initialPosition);

  const santaAloneUniqueHousesCount = pipe(
    curriedFollowInstructions,
    removeDuplicates,
    length
  )(instructions);

  console.log(
    `[2015, 3-1] Santa gave at least one present to ${santaAloneUniqueHousesCount} houses`
  );

  const santaInputs = instructions.filter((_, i) => i % 2 == 0);
  const robotSantaInputs = instructions.filter((_, i) => i % 2 == 1);

  const santaHouses = curriedFollowInstructions(santaInputs);
  const robotSantaHouses = curriedFollowInstructions(robotSantaInputs);

  const allUniqueHousesCount = removeDuplicates(
    concat(santaHouses, robotSantaHouses)
  ).length;

  console.log(
    `[2015, 3-2] Santa and robot Santa gave at least one present to ${allUniqueHousesCount} houses`
  );
}

function followInstructions(
  initial: Position,
  instructions: readonly string[]
): Position[] {
  return instructions.reduce(reducer, [initial]);
}

function removeDuplicates(positions: readonly Position[]): Position[] {
  return positions.reduce(
    (p: Position[], c) =>
      p.some((pos) => positionsMatch(pos, c)) ? p : p.concat(c),
    []
  );
}

const positionsMatch = (p1: Position, p2: Position): boolean => {
  return p1.x == p2.x && p1.y == p2.y;
};

const reducer = (
  visited: readonly Position[],
  instruction: string
): Position[] => {
  const lastVisited = visited[visited.length - 1];

  const newPosition = cond([
    [equals("<"), always({ x: lastVisited.x - 1, y: lastVisited.y })],
    [equals(">"), always({ x: lastVisited.x + 1, y: lastVisited.y })],
    [equals("^"), always({ x: lastVisited.x, y: lastVisited.y + 1 })],
    [equals("v"), always({ x: lastVisited.x, y: lastVisited.y - 1 })],
  ])(instruction);

  return visited.concat(newPosition);
};
