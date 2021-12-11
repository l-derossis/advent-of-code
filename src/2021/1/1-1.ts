type Accumulator = {
  previous: number;
  acc: number;
};

export function depthIncrease(data: string) {
  let reducer = (previous: Accumulator, current: number) => {
    return {
      previous: current,
      acc: previous.acc + (current > previous.previous ? 1 : 0),
    };
  };

  let count = data
    .split("\n")
    .map((v) => +v)
    .reduce(reducer, { previous: Number.MAX_VALUE, acc: 0 });

  console.log(`[2021, 1-1] Depth increase speed is ${count.acc}`);
}
