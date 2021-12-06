type Accumulator = number[];

interface Report {
  gamma: number;
  epsilon: number;
}

export function statusReportPowerConsumption(data: string) {
  let acc: Accumulator = buildAccumulator();

  let lines = data.split("\n");
  var result = lines.reduce(reducer, acc);

  console.log(result);

  let report = mapToReport(result, lines.length);

  console.log(`Power consumption is: ${report.epsilon * report.gamma}`);
}

let reducer = (accumulator: Accumulator, line: string): Accumulator => {
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
  let acc: Accumulator = new Array<number>(count);
  for (let i = 0; i < acc.length; ++i) acc[i] = 0;
  return acc;
}

function mapToReport(acc: Accumulator, linesCount: number): Report {
  let gamma: string = "";
  let epsilon: string = "";

  acc.forEach((v) => {
    let oneIsMostFrequent = v > linesCount / 2;
    gamma += oneIsMostFrequent ? "1" : "0";
    epsilon += oneIsMostFrequent ? "0" : "1";
  });

  console.log("gamma");
  console.log(gamma);
  console.log("epsilon");
  console.log(epsilon);

  return {
    gamma: parseInt(gamma, 2),
    epsilon: parseInt(epsilon, 2),
  };
}
