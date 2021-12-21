type Accumulator = number[];

interface Report {
  gamma: number;
  epsilon: number;
}

export function statusReportPowerConsumption(data: string) {
  const acc: Accumulator = buildAccumulator();

  const lines = data.split("\n");
  const result = lines.reduce(reducer, acc);
  const report = mapToReport(result, lines.length);

  console.log(
    `[2021, 3-1] Power consumption is: ${report.epsilon * report.gamma}`
  );
}

const reducer = (accumulator: Accumulator, line: string): Accumulator => {
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

function buildAccumulator(): Accumulator {
  const count = 12;
  const acc: Accumulator = new Array<number>(count);
  for (let i = 0; i < acc.length; ++i) acc[i] = 0;
  return acc;
}

function mapToReport(acc: Accumulator, linesCount: number): Report {
  let gamma = "";
  let epsilon = "";

  acc.forEach((v) => {
    const oneIsMostFrequent = v > linesCount / 2;
    gamma += oneIsMostFrequent ? "1" : "0";
    epsilon += oneIsMostFrequent ? "0" : "1";
  });

  return {
    gamma: parseInt(gamma, 2),
    epsilon: parseInt(epsilon, 2),
  };
}
