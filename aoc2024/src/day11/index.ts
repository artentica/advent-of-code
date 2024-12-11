import run from 'aocrunner';
import { LOADIPHLPAPI } from 'dns';

const parseInput = (rawInput: string) => rawInput.split(' ').map(Number);

const cache = new Map();

function loop(stone: number, step: number): number {
  const key = `${stone}/${step}`;
  if (cache.has(key)) return cache.get(key);
  if (step === 0) {
    cache.set(key, 1);
    return 1;
  }
  if (stone === 0) {
    const value = loop(1, step - 1);
    cache.set(key, value);
    return value;
  } else if (stone.toString().length % 2 === 0) {
    const str = stone.toString();
    const value =
      loop(Number(str.slice(0, str.length / 2)), step - 1) +
      loop(Number(str.slice(-str.length / 2)), step - 1);
    cache.set(key, value);
    return value;
  } else {
    const value = loop(stone * 2024, step - 1);
    cache.set(key, value);
    return value;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const steps = 25;
  return input.reduce((acc, stone) => loop(stone, steps) + acc, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const steps = 75;
  return input.reduce((acc, stone) => loop(stone, steps) + acc, 0);
};

run({
  part1: {
    tests: [
      {
        input: `125 17`,
        expected: 55312,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
