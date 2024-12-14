import run from 'aocrunner';

type Position = { x: number; y: number };

const parseInput = (rawInput: string): [Position, Position, Position][] =>
  rawInput
    .trim()
    .split('\n\n')
    .map((machine) => {
      const [buttonA, buttonB, prize] = machine.split('\n');
      const [, ax, ay] = buttonA.match(/X\+(\d+), Y\+(\d+)/)!.map(Number);
      const [, bx, by] = buttonB.match(/X\+(\d+), Y\+(\d+)/)!.map(Number);
      const [, px, py] = prize.match(/X=(\d+), Y=(\d+)/)!.map(Number);
      return [
        { x: ax, y: ay },
        { x: bx, y: by },
        { x: px, y: py },
      ];
    });

function calculateCost(a: number, b: number) {
  return 3 * a + b;
}

function findAB(a: Position, b: Position, prize: Position) {
  // Det
  const det = a.x * b.y - b.x * a.y;

  // si 0 pas de résultat
  if (det === 0) return { aEqu: null, bEqu: null };

  // equ lin
  const aEqu = (prize.x * b.y - b.x * prize.y) / det;
  const bEqu = (a.x * prize.y - prize.x * a.y) / det;

  if (
    Number.isInteger(aEqu) &&
    Number.isInteger(bEqu) &&
    aEqu >= 0 &&
    bEqu >= 0
  ) {
    return { aEqu, bEqu };
  }

  return { aEqu: null, bEqu: null };
}

function explore(inputs: [Position, Position, Position][]) {
  let sum = 0;
  for (const [a, b, prize] of inputs) {
    const { aEqu, bEqu } = findAB(a, b, prize);
    if (aEqu !== null && bEqu !== null) {
      sum += calculateCost(aEqu, bEqu);
    }
  }
  return sum;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return explore(input);
};

const part2 = (rawInput: string) => {
  const offset = 10_000_000_000_000;
  const input = parseInput(rawInput);
  const modiefiedInput = input.map(([a, b, prize]) => [
    a,
    b,
    {
      x: offset + prize.x,
      y: offset + prize.y,
    },
  ]) as [Position, Position, Position][];
  return explore(modiefiedInput);
};

run({
  part1: {
    tests: [
      {
        input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
        expected: 480,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
