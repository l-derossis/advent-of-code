import * as fs from "fs";

import { depthIncrease } from "./2021/1/1-1";
import { depthIncreaseSlidingWindow } from "./2021/1/1-2";
import { submarinePosition } from "./2021/2/2-1";
import { submarinePositionWithAim } from "./2021/2/2-2";
import { statusReportPowerConsumption } from "./2021/3/3-1";
import { statusReportLifeSupport } from "./2021/3/3-2";
import { bingo } from "./2021/4/4";
import { hydrothermalVents } from "./2021/5/5";
import { lanternFishes } from "./2021/6/6";
import { sortCrabs } from "./2021/7/7-1";
import { sortCrabsNonLinear } from "./2021/7/7-2";
import { digitalSegments } from "./2021/8/8-1";
import { digitalSegmentsFull } from "./2021/8/8-2";
import { lavaTubes } from "./2021/9/9";
import { syntaxScoring } from "./2021/10/10";
import { dumboOctopus } from "./2021/11/11";
import { notQuiteLisp } from "./2015/1";
import { passagePathing } from "./2021/12/12";
import { iWasToldThereWouldBeNoMath } from "./2015/2";
import { transparentOrigami } from "./2021/13/13";
import { perfectlySphericalHousesInAVacuum } from "./2015/3";
import { extendedPolymerization } from "./2021/14/14";
import { chiton } from "./2021/15/15";
import { packetDecoder } from "./2021/16/16";
import { theIdealStockingStuffer } from "./2015/4";

function execute(func: (arg: string) => void, inputFile: string) {
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (!err) {
      func(data);
    } else {
      console.log(err.message);
    }
  });
}

// 2015
//execute(notQuiteLisp, "inputs/2015/1.txt");
//execute(iWasToldThereWouldBeNoMath, "inputs/2015/2.txt");
//execute(perfectlySphericalHousesInAVacuum, "inputs/2015/3.txt");
//execute(theIdealStockingStuffer, "inputs/2015/4.txt"); // Some bruteforce is going on here, it takes some time.

// 2021
//execute(depthIncrease, "inputs/2021/1.txt");
//execute(depthIncreaseSlidingWindow, "inputs/2021/1.txt");
//execute(submarinePosition, "inputs/2021/2.txt");
//execute(submarinePositionWithAim, "inputs/2021/2.txt");
//execute(statusReportPowerConsumption, "inputs/2021/3.txt");
//execute(statusReportLifeSupport, "inputs/2021/3.txt");
//execute(bingo, "inputs/2021/4.txt");
//execute(hydrothermalVents, "inputs/2021/5.txt");
//execute(lanternFishes, "inputs/2021/6.txt");
//execute(sortCrabs, "inputs/2021/7.txt");
//execute(sortCrabsNonLinear, "inputs/2021/7.txt");
//execute(digitalSegments, "inputs/2021/8.txt");
//execute(digitalSegmentsFull, "inputs/2021/8.txt");
//execute(lavaTubes, "inputs/2021/9.txt");
//execute(syntaxScoring, "inputs/2021/10.txt");
//execute(dumboOctopus, "inputs/2021/11.txt");
//execute(passagePathing, "inputs/2021/12.txt");
//execute(transparentOrigami, "inputs/2021/13.txt");
//execute(extendedPolymerization, "inputs/2021/14.txt");
//execute(chiton, "inputs/2021/15.txt"); // This one takes a lot of time to process
//execute(packetDecoder, "inputs/2021/16.txt"); // This one takes a lot of time to process
