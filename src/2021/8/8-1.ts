type Signal = string;
class Digit {
  display: string;

  get value(): number | undefined {
    switch (this.display.length) {
      case 2:
        return 1;
      case 3:
        return 7;
      case 4:
        return 4;
      case 7:
        return 8;
      default:
        return undefined;
    }
  }

  constructor(display: string) {
    this.display = display;
  }
}

interface Dataset {
  signals: Signal[];
  digits: Digit[];
}

export function digitalSegments(data: string) {
  const stringDatasets = data.split("\n");
  const datasets: Dataset[] = [];
  stringDatasets.forEach((s) => {
    let split = s.split(" | ");

    datasets.push({
      signals: split[0].split(" "),
      digits: split[1].split(" ").map((s) => new Digit(s)),
    });
  });

  const totalKnownDigits = datasets.reduce(
    (p, c) =>
      p + c.digits.reduce((p, c) => p + (c.value != undefined ? 1 : 0), 0),
    0
  );

  console.log(`[2021, 8-1] Known digits (1, 4, 7, 8): ${totalKnownDigits}`);
}
