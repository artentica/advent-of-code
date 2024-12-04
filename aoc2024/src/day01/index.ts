import run from "aocrunner";

const separator = "   ";
const parseInput = (rawInput: string) => {
  return rawInput.split("\n").reduce<[number[], number[]]>(([left, right], line) => {
    const temp = line.split(separator);
    left.push(Number(temp[0]));
    right.push(Number(temp[1]));
    return [left, right];
  }, [[], []]);
};

const part1 = (rawInput: string) => {
  const [left, right] = parseInput(rawInput).map(el => el.sort());
  return left.reduce((acc, left, idx) => {
    return Math.abs(left - right[idx]) + acc;
  }, 0);
};

const part2 = (rawInput: string) => {
  const [left, right] = parseInput(rawInput).map(el => el.sort());
  const recurenceleft: Record<string, number> = {}
  const recurenceRight: Record<string, number> = {}
  for(let i = 0; i < right.length; i++) {
    recurenceleft[left[i].toString()] = (recurenceleft[left[i].toString()] ?? 0) + 1;
    recurenceRight[right[i].toString()] = (recurenceRight[right[i].toString()] ?? 0) + 1;
  }

  return Object.keys(recurenceleft).reduce((acc, key) => {
    return acc + (recurenceleft[key] ?? 0) * (recurenceRight[key] ?? 0) * Number(key);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
