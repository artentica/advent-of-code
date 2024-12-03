import run from 'aocrunner';

const parseInput = (rawInput: string) => {
  return rawInput.split('\n').map((line) => line.split(' ').map(Number));
};

function isSafe(line: number[]) {
  if (line.length <= 1) return true;
  let tendency = line[1] - line[0];
  const monotonic = (a: number, b: number) => tendency > 0 ? a < b : a > b
  return line.every(
    (num, i, arr) =>
      i === 0 || (monotonic(arr[i - 1], num) && Math.abs(num - arr[i - 1]) <= 3),
  );
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((acc, line) => {
    return acc + (isSafe(line) ? 1 : 0);
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
