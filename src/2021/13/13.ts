import { curry, pipe, range } from "ramda";

interface Coordinates {
  x: number;
  y: number;
}

type Sheet = readonly Coordinates[];

enum Axis {
  x,
  y,
}

interface Fold {
  axis: Axis;
  index: number;
}

export function transparentOrigami(data: string) {
  const [coordinates, folds] = loadData(data);

  const foldedOnce = fold(coordinates, folds[0]);
  console.log(
    `[2021, 13-01] Dots after applying first fold: ${foldedOnce.length}`
  );

  const foldedCompletely = folds.reduce((p, c) => fold(p, c), coordinates);
  console.log("[2021, 13-02] Dots after all folds:");
  display(foldedCompletely);
}

function display(sheet: Sheet) {
  const h = height(sheet);
  const w = width(sheet);

  for (let j = 0; j < h; ++j) {
    let line = "";
    for (let i = 0; i < w; ++i) {
      line += exists(i, j, sheet) ? "#" : ".";
    }
    console.log(line);
  }
}

function exists(x: number, y: number, sheet: Sheet): boolean {
  return sheet.some((p) => p.x == x && p.y == y);
}

function fold(sheet: Sheet, fold: Fold): Sheet {
  const sheetBorder = higherCoordinate(sheet, fold.axis) + 1;
  const curriedReducer = curry(foldReducer)(fold);
  const folded = range(0, sheetBorder - fold.index + 1).reduce(
    curriedReducer,
    sheet
  );
  return removeDuplicates(folded);
}

const move = (
  sheet: Sheet,
  axis: Axis,
  distance: number,
  points: readonly Coordinates[]
): Sheet => {
  return sheet
    .filter((point) => points.find((p) => equals(point, p)) == undefined)
    .concat(
      points.map((p) => {
        return {
          x: axis == Axis.x ? p.x - distance : p.x,
          y: axis == Axis.y ? p.y - distance : p.y,
        };
      })
    );
};

const foldReducer = (fold: Fold, sheet: Sheet, index: number): Sheet => {
  const cPointsOnAxis = curry(pointsOnAxis)(sheet, fold.axis);
  const cMove = curry(move)(sheet, fold.axis, index * 2);
  return pipe(cPointsOnAxis, cMove)(fold.index + index);
};

const pointsOnAxis = (
  sheet: Sheet,
  axis: Axis,
  position: number
): Coordinates[] => {
  return sheet.filter((point) =>
    axis == Axis.x ? point.x == position : point.y == position
  );
};

const removeDuplicates = (sheet: Sheet): Sheet => {
  return sheet.reduce(
    (p: Coordinates[], c) =>
      p.some((point) => equals(point, c)) ? p : p.concat(c),
    []
  );
};

const equals = (point1: Coordinates, point2: Coordinates): boolean => {
  return point1.x == point2.x && point1.y == point2.y;
};

const height = (sheet: Sheet): number => {
  return higherCoordinate(sheet, Axis.y) + 1;
};

const width = (sheet: Sheet): number => {
  return higherCoordinate(sheet, Axis.x) + 1;
};

const higherCoordinate = (sheet: Sheet, axis: Axis): number => {
  return sheet.reduce((p, c) => {
    const value = axis == Axis.x ? c.x : c.y;
    return value > p ? value : p;
  }, -1);
};

function loadData(data: string): [Sheet, Fold[]] {
  const initial: DataAccumulator = { folds: [], coordinates: [] };
  const accumulated = data.split("\n").reduce(dataReducer, initial);
  return [accumulated.coordinates, accumulated.folds];
}

interface DataAccumulator {
  coordinates: Sheet;
  folds: Fold[];
}
const dataReducer = (acc: DataAccumulator, line: string): DataAccumulator => {
  return {
    coordinates: [...line].includes(",")
      ? acc.coordinates.concat(parseCoordinates(line))
      : acc.coordinates,
    folds:
      line.substring(0, 4) == "fold"
        ? acc.folds.concat(parseFold(line))
        : acc.folds,
  };
};

const parseCoordinates = (line: string): Coordinates => {
  const split = line.split(",");
  return {
    x: +split[0],
    y: +split[1],
  };
};

const parseFold = (line: string): Fold => {
  const split = line.split(" ")[2].split("=");
  return {
    axis: split[0] == "x" ? Axis.x : Axis.y,
    index: +split[1],
  };
};
