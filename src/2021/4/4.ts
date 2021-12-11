class Board {
  private rows: number[][] = [];

  addRow(row: number[]) {
    this.rows.push(row);
  }

  isWinning(inputs: number[]): boolean {
    for (let i = 0; i < this.size(); ++i) {
      if (
        this.rowAt(i).every((v) => inputs.includes(v)) ||
        this.columnAt(i).every((v) => inputs.includes(v))
      ) {
        return true;
      }
    }

    return false;
  }

  score(inputs: number[]): number {
    if (!this.isWinning(inputs)) {
      return 0;
    }

    const unmarked: number[] = [];

    this.rows.forEach((r) => {
      unmarked.push(...r.filter((value) => !inputs.includes(value)));
    });

    var sum = unmarked.reduce((previous, value) => previous + value);
    return sum * inputs[inputs.length - 1];
  }

  private size(): number {
    return this.rows[0].length;
  }

  private rowAt(position: number): number[] {
    return this.rows[position];
  }

  private columnAt(position: number): number[] {
    return this.rows.reduce((array, row) => {
      array.push(row[position]);
      return array;
    }, []);
  }

  equals(board: Board): boolean {
    for (let i = 0; i < this.rows.length; ++i) {
      for (let j = 0; j < this.rows[i].length; ++j) {
        if (!(this.rows[i][j] == board.rows[i][j])) {
          return false;
        }
      }
    }

    return true;
  }
}

export function bingo(data: string) {
  const lines = data.split("\n");
  const inputs = lines
    .shift()
    ?.split(",")
    .map((v) => +v);

  const boards = parseBoards(lines);

  if (!inputs || boards.length == 0) {
    throw new Error("Invalid input file.");
  }

  const firstWinningScore = findFirstWinningBoard(boards, inputs);
  const lastWinningScore = findLastWinningBoard(boards, inputs);

  console.log(
    `[2021, 4-1] First winning board score is: ${firstWinningScore?.board.score(
      firstWinningScore.usedInputs
    )}`
  );
  console.log(
    `[2021, 4-2] Last winning board score is: ${lastWinningScore?.board.score(
      lastWinningScore.usedInputs
    )}`
  );
}

function findFirstWinningBoard(
  boards: Board[],
  input: number[]
): { board: Board; usedInputs: number[] } | undefined {
  const usedInputs: number[] = [];
  let winning: Board | undefined = undefined;

  let i = 0;
  while (!winning) {
    usedInputs.push(input[i]);
    winning = boards.find((b) => b.isWinning(usedInputs));
    ++i;
  }

  return winning ? { board: winning, usedInputs: usedInputs } : undefined;
}

function findLastWinningBoard(
  boards: Board[],
  input: number[]
): { board: Board; usedInputs: number[] } | undefined {
  const inputsUsedInAWin: number[] = [];
  let inputsBeingCheckedForAWin: number[] = [];
  const winningBoards: Board[] = [];
  let boardsLocal = [...boards];

  input.forEach((i) => {
    inputsBeingCheckedForAWin.push(i);

    let winningThisRound = boardsLocal.filter((b) =>
      b.isWinning(inputsUsedInAWin.concat(inputsBeingCheckedForAWin))
    );

    if (winningThisRound.length > 0) {
      boardsLocal = removeBoards(boardsLocal, winningThisRound);
      inputsUsedInAWin.push(...inputsBeingCheckedForAWin);
      inputsBeingCheckedForAWin = [];
      winningBoards.push(...winningThisRound);
    }
  });

  return winningBoards.length > 1
    ? {
        board: winningBoards[winningBoards.length - 1],
        usedInputs: inputsUsedInAWin,
      }
    : undefined;
}

function removeBoards(boards: Board[], toRemove: Board[]): Board[] {
  return boards.filter((b) => !toRemove.find((tr) => tr.equals(b)));
}

function parseBoards(lines: string[]): Board[] {
  const boards: Board[] = [];

  const parseLine = (line: string): number[] => {
    return line
      .replace(/\s{2,}/g, " ")
      .trimStart()
      .split(" ")
      .map((v) => +v);
  };

  while (lines.length > 0) {
    const line = lines.shift();

    if (!line) {
      boards.push(new Board());
    } else {
      boards[boards.length - 1].addRow(parseLine(line));
    }
  }

  return boards;
}
