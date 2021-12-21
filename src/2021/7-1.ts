export function sortCrabs(data: string) {
  const crabs = data.split(",").map((c) => +c);

  const sorted = crabs.sort((a, b) => a - b);
  const middleValue = sorted[Math.round(sorted.length / 2)];

  const fuel = crabs.reduce((p, c) => p + Math.abs(c - middleValue), 0);

  console.log(`[2021, 7-1] Minimum fuel for linear crabs movement: ${fuel}`);
}
