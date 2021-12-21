interface ProbeState {
  x: number;
  y: number;
  xVelocity: number;
  yVelocity: number;
}

interface Range {
  min: number;
  max: number;
}

interface Target {
  xRange: Range;
  yRange: Range;
}

enum TargetStatus {
  Reachable,
  Reached,
  Unreachable,
}

export function trickShot(data: string) {
  const [xRange, yRange] = loadData(data);

  const [maxHeight, successfulInitialStates] = getResults({ xRange, yRange });

  console.log(`[2021, 17-01] Max Y position reached: ${maxHeight}`);
  console.log(
    `[2021, 17-02] Successful initial velocities ${successfulInitialStates.length}`
  );
}

const getResults = (target: Target): [number, ProbeState[]] => {
  let maxHeight = 0;
  let yVel = target.yRange.min;
  let xVel = 0;
  let consecutivesFailures = 0;
  const successfulInitialStates: ProbeState[] = [];

  do {
    while (xVel <= target.xRange.max) {
      const initialState = initialStateForVelocity(xVel, yVel);
      xVel++;
      const result = launchState(initialState, target);
      if (result.success) {
        successfulInitialStates.push(initialState);
        maxHeight = result.higherState.y;
        consecutivesFailures = 0;
      }
    }
    yVel++;
    xVel = 0;
    consecutivesFailures++;
  } while (consecutivesFailures < 20);

  return [maxHeight, successfulInitialStates];
};

const initialStateForVelocity = (xVel: number, yVel: number): ProbeState => {
  return {
    x: 0,
    y: 0,
    xVelocity: xVel,
    yVelocity: yVel,
  };
};

type SuccessState =
  | { success: false }
  | { success: true; higherState: ProbeState };

const launchState = (
  initialState: ProbeState,
  target: Target
): SuccessState => {
  let currentStatus = TargetStatus.Reachable;
  let currentState = { ...initialState };
  let higherState = { ...initialState };

  do {
    currentStatus = status(currentState, target.xRange, target.yRange);
    currentState = move(currentState);
    higherState = currentState.y > higherState.y ? currentState : higherState;
  } while (currentStatus == TargetStatus.Reachable);

  return currentStatus == TargetStatus.Reached
    ? { success: true, higherState }
    : { success: false };
};

const status = (
  state: ProbeState,
  xRange: Range,
  yRange: Range
): TargetStatus => {
  if (state.x > xRange.max || state.y < yRange.min)
    return TargetStatus.Unreachable;
  if (state.x < xRange.min || state.y > yRange.max)
    return TargetStatus.Reachable;
  return TargetStatus.Reached;
};

const move = (state: ProbeState): ProbeState => {
  return {
    x: state.x + state.xVelocity,
    y: state.y + state.yVelocity,
    xVelocity: nextXVelocity(state.xVelocity),
    yVelocity: state.yVelocity - 1,
  };
};

const nextXVelocity = (xVel: number): number => {
  if (xVel > 0) return xVel - 1;
  if (xVel < 0) return xVel + 1;
  return 0;
};

function loadData(data: string): [Range, Range] {
  const split = data
    .substring(15)
    .split(", y=")
    .map((s) => {
      return { min: +s.split("..")[0], max: +s.split("..")[1] };
    });

  return [split[0], split[1]];
}
