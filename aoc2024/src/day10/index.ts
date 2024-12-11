import run from "aocrunner";

type Position = { x: number; y: number };

const directions: Position[] = [
  { x: 1, y: 0 },   // Horizontal right
  { x: 0, y: -1 },  // Horizontal left
  { x: 0, y: 1 },   // Vertical down
  { x: -1, y: 0 },  // Vertical up
];

const parseInput = (rawInput: string) => {
  return rawInput.split('\n').map((line) => line.split('').map(Number));
};

function getPath(map: number[][], position: Position, target: number): Position[] {
  const [maxY, maxX] = [map.length, map[0].length];
  const foundPositions: Position[] = [];
  if(map[position.y][position.x] === 9) {
    return [position];
  }

    for (const direction of directions) {
      const nextX = position.x + direction.x;
      const nextY = position.y + direction.y;

      // If out of bound we can stop
      if (nextX < 0 || nextX >= maxX || nextY < 0 || nextY >= maxY) {
        continue;
      }

      if (map[nextY][nextX] === target) {
        foundPositions.push(...getPath(map, { x: nextX, y: nextY }, target + 1));
      }
    }
  return foundPositions;
}

function exploreMap(map: number[][]) {
  let pathFound: Record<string, Position[]> = {}
  for (let y = 0; y < map.length; y++) {
    const elementY = map[y];
    for (let x = 0; x < elementY.length; x++) {
      const elementX = elementY[x];
      if (elementX === 0) {
        pathFound[`${x},${y}`] = getPath(map, {x, y}, 1);
      }
    }
  }
  return pathFound;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const exploredMap = exploreMap(input);
  let sum = 0;
  for (const key of Object.keys(exploredMap)) {
    let positionEnd = new Set<string>();
    exploredMap[key].forEach(position => {
      positionEnd.add(`${position.x},${position.y}`);
    });
    sum += positionEnd.size;
  }
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const exploredMap = exploreMap(input);
  let sum = 0;
  for (const key of Object.keys(exploredMap)) {
    sum += exploredMap[key].length;
  }
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
