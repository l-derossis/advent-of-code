import * as fs from "fs";

import { depthIncrease } from "./1/1-1";
import { depthIncreaseSlidingWindow } from "./1/1-2";
import { submarinePosition } from "./2/2-1";
import { submarinePositionWithAim } from "./2/2-2";
import { statusReportPowerConsumption } from "./3/3-1";
import { statusReportLifeSupport } from "./3/3-2";
import { bingo } from "./4/4";
import { hydrothermalVents } from "./5/5";
import { lanternFishes } from "./6/6";

function execute(func: (arg: string) => void, inputFile: string) {
  fs.readFile(inputFile, "utf8", (err, data) => {
    func(data);
    if (!err) {
    } else {
      console.log(err.message);
    }
  });
}

//execute(depthIncrease, "inputs/1-1.txt");
//execute(depthIncreaseSlidingWindow, "inputs/1-1.txt");
//execute(submarinePosition, "inputs/2-1.txt");
//execute(submarinePositionWithAim, "inputs/2-1.txt");
//execute(statusReportPowerConsumption, "inputs/3-1.txt");
//execute(statusReportLifeSupport, "inputs/3-1.txt");
//execute(bingo, "inputs/4.txt");
//execute(hydrothermalVents, "inputs/5.txt");
execute(lanternFishes, "inputs/6.txt");
