export function syntaxScoring(data: string) {
  const lines = data.split("\n");

  console.log(`[2021, 10-1] Corrupted lines score: ${illegalScore(lines)}`);
  console.log(`[2021, 10-2] Incomplete lines score: ${incompleteScore(lines)}`);
}

interface LineValidity {
  valid: boolean;
  firstIllegalChar?: string;
  missingClosing?: string[];
}

enum ClosingScoreType {
  Incomplete,
  Illegal,
}

function illegalScore(lines: string[]): number {
  return lines.reduce((p, c) => {
    const validity = checkLine([...c]);
    return (
      p +
      (validity.firstIllegalChar == undefined
        ? 0
        : score(validity.firstIllegalChar!, ClosingScoreType.Illegal))
    );
  }, 0);
}

function incompleteScore(lines: string[]): number {
  const scores = lines.reduce((p: number[], c) => {
    const validity = checkLine([...c]);
    if (validity.missingClosing != undefined) {
      p.push(incompleteClosingsScore(validity.missingClosing!));
    }

    return p;
  }, []);

  return scores.sort((a, b) => a - b).at(Math.floor(scores.length / 2))!;
}

function incompleteClosingsScore(closings: string[]): number {
  return closings.reduceRight((p, c) => {
    return p * 5 + score(c, ClosingScoreType.Incomplete);
  }, 0);
}

function checkLine(line: string[]): LineValidity {
  const stack: string[] = [];
  const lineCopy = [...line];

  while (lineCopy.length > 0) {
    const head = lineCopy.shift()!;
    if (getClosing(head) != undefined) {
      stack.push(head);
    } else {
      if (getClosing(stack.pop()!) != head) {
        return { valid: false, firstIllegalChar: head };
      }
    }
  }

  if (stack.length > 0) {
    return {
      valid: false,
      missingClosing: stack.map((opening) => getClosing(opening)!),
    };
  }

  return { valid: true };
}

function getClosing(opening: string): string | undefined {
  switch (opening) {
    case "(":
      return ")";
    case "[":
      return "]";
    case "{":
      return "}";
    case "<":
      return ">";
    default:
      return undefined;
  }
}

function score(closing: string, scoreType: ClosingScoreType): number {
  switch (closing) {
    case ")":
      return scoreType == ClosingScoreType.Illegal ? 3 : 1;
    case "]":
      return scoreType == ClosingScoreType.Illegal ? 57 : 2;
    case "}":
      return scoreType == ClosingScoreType.Illegal ? 1197 : 3;
    case ">":
      return scoreType == ClosingScoreType.Illegal ? 25137 : 4;
    default:
      throw new Error("Invalid input");
  }
}
