interface GlobalAccumulator {
  values: string[];
  i: number;
  compare: (x: number, y: number) => boolean;
}

export function statusReportLifeSupport(data: string) {
  const oxygen = readLifeReportValue(data, "oxygen");
  const co2 = readLifeReportValue(data, "co2");
  console.log(`[2021, 3-2] Life support rating is: ${oxygen * co2}`);
}

function readLifeReportValue(data: string, value: "oxygen" | "co2"): number {
  let acc: GlobalAccumulator = buildGlobalAccumulator(
    data.split("\n"),
    value == "oxygen"
  );

  do {
    acc = reducer(acc);
  } while (acc.values.length > 1);

  return parseInt(acc.values[0], 2);
}

const reducer = (accumulator: GlobalAccumulator): GlobalAccumulator => {
  const mfb = getMostFrequentBit(
    accumulator.values,
    accumulator.i,
    accumulator.compare
  );
  const matchingValues = accumulator.values.filter(
    (v) => v.charAt(accumulator.i) == mfb
  );

  return {
    values: matchingValues,
    i: accumulator.i + 1,
    compare: accumulator.compare,
  };
};

function buildGlobalAccumulator(
  data: string[],
  getMsb: boolean
): GlobalAccumulator {
  return {
    values: data,
    i: 0,
    compare: getMsb ? (x, y) => x >= y : (x, y) => x < y,
  };
}

function getMostFrequentBit(
  values: string[],
  position: number,
  compare: (x: number, y: number) => boolean
): string {
  const acc = buildMfbAccumulator(values[0].length);
  values.reduce(mfbReducer, acc);
  return compare(acc.at(position) ?? 0, values.length / 2) ? "1" : "0";
}

type MfbAccumulator = number[];

const mfbReducer = (
  accumulator: MfbAccumulator,
  line: string
): MfbAccumulator => {
  if (line.length != accumulator.length) {
    throw new Error("Invalid input");
  }
  for (let i = 0; i < line.length; ++i) {
    if (line.charAt(i) == "1") {
      ++accumulator[i];
    }
  }

  return accumulator;
};

function buildMfbAccumulator(arrayLength: number): MfbAccumulator {
  const acc: MfbAccumulator = new Array<number>(arrayLength);
  for (let i = 0; i < acc.length; ++i) acc[i] = 0;
  return acc;
}
