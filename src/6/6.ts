export function lanternFishes(data: string) {
  let fishes = parseData(data);

  console.log(`Count after  80 days: ${getFishCount(fishes, 80)}`);
  console.log(`Count after 256 days: ${getFishCount(fishes, 256)}`);
}

function getFishCount(fishes: number[], days: number): number {
  let sorted = getSortedFishes(fishes);

  for (let i = 0; i < days; ++i) {
    sorted = passDay(sorted);
  }

  return sorted.reduce((p, c) => p + c);
}

function getSortedFishes(fishes: number[]): number[] {
  const sortedFishes: number[] = [];

  for (let i = 0; i <= 8; ++i) {
    sortedFishes[i] = fishes.filter((f) => f == i).length;
  }

  return sortedFishes;
}

function passDay(sortedFishes: number[]): number[] {
  var nextSortedFishes: number[] = [...sortedFishes];
  let readyFishes = nextSortedFishes.shift();
  nextSortedFishes.push(readyFishes!);
  nextSortedFishes[6] += readyFishes!;

  return nextSortedFishes;
}

function parseData(data: string): number[] {
  return data.split(",").map((v) => +v);
}
