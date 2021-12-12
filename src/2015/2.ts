interface Dimensions {
  length: number;
  width: number;
  height: number;
}

interface Total {
  paper: number;
  ribbon: number;
}

export function iWasToldThereWouldBeNoMath(data: string) {
  const dimensions = loadData(data);

  const initial: Total = { paper: 0, ribbon: 0 };
  const total = dimensions.reduce((p: Total, c) => {
    return {
      paper: p.paper + paperForDimensions(c),
      ribbon: p.ribbon + ribbonForDimensions(c),
    };
  }, initial);

  console.log(
    `[2015, 2-1] Total wrapping paper (square feets): ${total.paper}`
  );
  console.log(`[2015, 2-1] Total ribbon (feets): ${total.ribbon}`);
}

const paperForDimensions = (dim: Dimensions): number => {
  const areas = [
    dim.length * dim.width,
    dim.width * dim.height,
    dim.height * dim.length,
  ];

  return areas.reduce((p, c) => p + 2 * c, 0) + Math.min(...areas);
};

const ribbonForDimensions = (dim: Dimensions): number => {
  const wrap = [dim.height, dim.width, dim.length]
    .sort((a, b) => a - b)
    .slice(0, 2)
    .reduce((p, c) => p + 2 * c, 0);

  const bow = dim.height * dim.width * dim.length;

  return wrap + bow;
};

function loadData(data: string): Dimensions[] {
  return data.split("\n").map((line) => toDimensions(line));
}

const toDimensions = (line: string): Dimensions => {
  const values = line.split("x");
  return {
    length: +values[0],
    width: +values[1],
    height: +values[2],
  };
};
