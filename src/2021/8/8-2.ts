export function digitalSegmentsFull(data: string) {
  const lines = data.split("\n");

  const sum = lines.reduce((p, c) => {
    const slices = c.split(" | ");
    const digits = slices[1].split(" ");
    const signalSolver = new SignalsSolver();
    signalSolver.solveSignals(slices[0].split(" "));
    return (
      p +
      parseInt(
        digits.reduce((pr, cu) => "" + pr + signalSolver.getDigit(cu), "")
      )
    );
  }, 0);

  console.log(`[2021, 8-2] Sum of all digits is: ${sum}`);
}

type PossibilityRow = string[][];

// This is an over-complicated method, the problem could have been solved
// in a much simpler way. But I wanted to find a general solution that does not
// require having to pick segments in a specific order. This solution just
// requires to pass the inputs sorted by length and will solve the problem
// by itself.
class SignalsSolver {
  // Segments are numeroted from 0 to 7 top to bottom and left to right
  private digitSegments: number[][] = [
    [0, 1, 2, 4, 5, 6],
    [2, 5],
    [0, 2, 3, 4, 6],
    [0, 2, 3, 5, 6],
    [1, 2, 3, 5],
    [0, 1, 3, 5, 6],
    [0, 1, 3, 4, 5, 6],
    [0, 2, 5],
    [0, 1, 2, 3, 4, 5, 6],
    [0, 1, 2, 3, 5, 6],
  ];

  private possibilities: PossibilityRow = this.buildPossibilityRow();
  private buildPossibilityRow(): PossibilityRow {
    const row: PossibilityRow = [];
    for (let i = 0; i < 7; ++i) {
      row.push([]);
    }
    return row;
  }

  solveSignals(inputs: string[]) {
    const sorted = inputs.sort((a, b) => a.length - b.length);
    sorted.forEach((s) => {
      this.addInput(s);
    });
  }

  private addInput(input: string) {
    const signals = [...input];
    const digits = this.possibleDigitSegmentsForSignals(signals);
    const possibleSegments = this.combineDigitSegments(digits);

    const signalsToAdd = this.buildPossibilityRow();
    const alreadyDeclaredSegments = this.buildPossibilityRow();

    signals.forEach((signal) => {
      const emptySegments: number[] = [];
      const segmentsWithSignal: number[] = [];

      possibleSegments.forEach((ps) => {
        if (this.possibilities[ps].length == 0) {
          emptySegments.push(ps);
        } else if (this.possibilities[ps].includes(signal)) {
          segmentsWithSignal.push(ps);
        }
      });

      if (segmentsWithSignal.length == 0) {
        emptySegments.forEach((es) => signalsToAdd[es].push(signal));
      } else {
        segmentsWithSignal.forEach((es) =>
          alreadyDeclaredSegments[es].push(signal)
        );
      }
    });

    this.mergeInPossibilityRow(signalsToAdd);
    this.clearPossibilities(alreadyDeclaredSegments);
  }

  getDigit(input: string): number {
    const signals = [...input];
    const segments: number[] = [];

    signals.forEach((s) =>
      segments.push(this.possibilities.findIndex((p) => p.includes(s)))
    );

    return this.getDigitFromSegments(segments);
  }

  private getDigitFromSegments(segments: number[]): number {
    return this.digitSegments.findIndex(
      (ds) =>
        ds.length == segments.length && segments.every((s) => ds.includes(s))
    );
  }

  private mergeInPossibilityRow(row: PossibilityRow) {
    row.forEach((signals, i) => {
      signals.forEach((s) => {
        if (!this.possibilities[i].includes(s)) {
          this.possibilities[i].push(s);
        }
      });
    });
  }

  private clearPossibilities(row: PossibilityRow) {
    row.forEach((signals, i) => {
      if (
        signals.length == 1 &&
        row.filter((s) => s.includes(signals[0])).length <= 1
      ) {
        this.possibilities.forEach((p, j) => {
          if (p.includes(signals[0])) {
            if (i == j) this.possibilities[j] = signals;
            else
              this.possibilities[j].splice(
                this.possibilities[j].indexOf(signals[0]),
                1
              );
          }
        });
      }
    });
  }

  private possibleDigitSegmentsForSignals(signals: string[]): number[][] {
    return this.digitSegments.filter(
      (s) =>
        s.length == signals.length &&
        this.isDigitCompatibleWithSignals(signals, s)
    )!;
  }

  private combineDigitSegments(digitSegments: number[][]): number[] {
    return digitSegments.reduce(
      (p, c) => p.concat(c.filter((segment) => !p.includes(segment))),
      []
    );
  }

  private isDigitCompatibleWithSignals(
    signals: string[],
    segments: number[]
  ): boolean {
    const sameSize = signals.length == segments.length;
    const signalsMatch = () => {
      const signalsCopy = [...signals];
      const digitPossibilities = this.possibilities.filter((_, i) =>
        segments.includes(i)
      );

      while (signalsCopy.length > 0) {
        const signal = signalsCopy.shift()!;
        if (!this.matchedSignals.includes(signal)) continue;

        const index = digitPossibilities.findIndex((d) => d.includes(signal));
        if (index != -1) {
          digitPossibilities.splice(index, 1);
        } else {
          return false;
        }
      }

      while (digitPossibilities.length > 0) {
        const possibilities = digitPossibilities.shift()!;
        if (!possibilities.every((p) => signals.includes(p))) {
          return false;
        }
      }

      return true;
    };

    return sameSize && signalsMatch();
  }

  private get matchedSignals(): string[] {
    return this.possibilities.reduce(
      (p, c) => p.concat(c.filter((s) => !p.includes(s))),
      []
    );
  }
}
