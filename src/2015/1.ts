interface Accumulator {
  floor: number;
  reachingBasementIndex: number;
}

function reducer(
  previous: Accumulator,
  current: string,
  index: number
): Accumulator {
  const reachedFloor = previous.floor + (current == "(" ? 1 : -1);
  return {
    floor: reachedFloor,
    reachingBasementIndex:
      previous.reachingBasementIndex == -1 && reachedFloor == -1
        ? index
        : previous.reachingBasementIndex,
  };
}

export function notQuiteLisp(data: string) {
  const initialState = {
    floor: 0,
    reachingBasementIndex: -1,
  };
  const finalState = [...data].reduce(
    (p, c, i) => reducer(p, c, i),
    initialState
  );

  console.log(`[2015, 1-1] Reached floor: ${finalState.floor}`);
  console.log(
    `[2015, 1-2] Reached basement at index: ${
      finalState.reachingBasementIndex + 1
    }`
  );
}
