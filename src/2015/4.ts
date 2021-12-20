import { Md5 } from "ts-md5";

export function theIdealStockingStuffer(data: string) {
  const result5Z = bruteforce(data, 5);
  const result6Z = bruteforce(data, 6);

  console.log(
    `[2015, 04-01] Number for a hash starting with five 0s: ${result5Z}`
  );
  console.log(
    `[2015, 04-02] Number for a hash starting with six 0s: ${result6Z}`
  );
}

function bruteforce(key: string, zerosCount: number): number {
  let hash: string;
  let i = 0;
  do {
    ++i;
    hash = Md5.hashStr(key + i);
  } while (!(hash.substring(0, zerosCount) == "0".repeat(zerosCount)));

  return i;
}
