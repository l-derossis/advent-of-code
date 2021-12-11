type Accumulator = {
  value: number;
  window: number;
  acc: number;
};

export function depthIncreaseSlidingWindow(data: string) {
  let reducer = (
    previous: Accumulator,
    current: number,
    i: number,
    array: number[]
  ): Accumulator => {
    let window =
      array[i + 1] && array[i + 2] ? current + array[i + 1] + array[i + 2] : 0;

    return {
      value: current,
      window: window,
      acc: previous.acc + (window > previous.window ? 1 : 0),
    };
  };

  let count = data
    .split("\n")
    .map((v) => +v)
    .reduce(reducer, {
      value: Number.MAX_VALUE,
      window: Number.MAX_VALUE,
      acc: 0,
    });

  console.log(`[2021, 1-2] Depth increase speed is ${count.acc}`);
}
