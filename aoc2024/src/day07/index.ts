import run from 'aocrunner';

const parseInput = (rawInput: string) => {
  return rawInput
    .split('\n')
    .map((el) => el.split(': ').flatMap((line) => line.split(' ').map(Number)));
};

function evaluate(
  index: number,
  currentValue: number,
  target: number,
  numbers: number[],
  evaluateConcat = false,
): boolean {
  if (index === numbers.length) {
    return currentValue === target;
  }
  if (currentValue > target) {
    return false;
  }

  return (
    evaluate(
      index + 1,
      currentValue + numbers[index],
      target,
      numbers,
      evaluateConcat,
    ) || // Add
    evaluate(
      index + 1,
      currentValue * numbers[index],
      target,
      numbers,
      evaluateConcat,
    ) || // Mul
    (evaluateConcat &&
      evaluate(
        index + 1,
        concatNumber(currentValue, numbers[index]),
        target,
        numbers,
        evaluateConcat,
      )) // Concat
  );
}

function concatNumber(a: number, b: number) {
  return Number(a.toString() + b.toString());
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((acc, curr) => {
    const target = curr.shift();
    if (evaluate(1, curr[0], target!, curr)) {
      acc += target!;
    }
    return acc;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((acc, curr) => {
    const target = curr.shift();
    if (evaluate(1, curr[0], target!, curr, true)) {
      acc += target!;
    }
    return acc;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 3749,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 11387,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
