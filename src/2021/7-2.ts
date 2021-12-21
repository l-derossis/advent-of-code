export function sortCrabsNonLinear(data: string) {
  const crabs = data.split(",").map((c) => +c);
  const mean = Math.round(crabs.reduce((p, c) => p + c) / crabs.length);

  // We know that the position for minimum consumption is going to be around the mean.
  // But we don't know if it's higher or lower. So we compute the mean, find in which
  // direction is the minimum value, and then compute every value until it starts going up.

  const meanPositionFuel = getCrabsFuelForMeetingPoint(crabs, mean);

  const higher =
    meanPositionFuel > getCrabsFuelForMeetingPoint(crabs, mean + 1);

  let minFuel = meanPositionFuel;
  for (let i = mean; ; higher ? ++i : --i) {
    const fuel = getCrabsFuelForMeetingPoint(crabs, i);
    if (fuel <= minFuel) {
      minFuel = fuel;
    } else {
      break;
    }
  }

  console.log(
    `[2021, 7-2] Minimum fuel for non linear crabs movement: ${minFuel}`
  );
}

function getCrabsFuelForMeetingPoint(crabs: number[], position: number) {
  return crabs.reduce((p, c) => p + getCrabFuelForMeetingPoint(c, position), 0);
}

function getCrabFuelForMeetingPoint(crab: number, position: number) {
  const distance = Math.abs(crab - position);
  return (distance * (1 + distance)) / 2;
}
