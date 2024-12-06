import run from 'aocrunner';

type Direction = '^' | '>' | 'v' | '<';
type Position = { x: number; y: number };

const MOVES: Record<Direction, Position> = {
  '^': { x: 0, y: -1 },
  '>': { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  '<': { x: -1, y: 0 },
};

const parseInput = (rawInput: string) => {
  return rawInput.split('\n');
};

function isDirection(value: string): value is Direction {
  return Object.keys(MOVES).includes(value);
}

function findStartPosition(map: string[]) {
  for (let y = 0; y < map.length; y++) {
    const elementY = map[y];
    for (let x = 0; x < elementY.length; x++) {
      const elementX = elementY[x];
      if (isDirection(elementX)) {
        return {
          x,
          y,
        };
      }
    }
  }
  throw 'No start found';
}

function exploreMap(map: string[], startPosition: Position) {
  const [maxY, maxX] = [map.length, map[0].length];
  const allDirection: Direction[] = Object.keys(MOVES) as Direction[];

  let x = startPosition.x;
  let y = startPosition.y;
  let direction = map[y][x] as Direction;

  let positionGuard = new Set<string>();
  // We add the first position
  positionGuard.add(`${startPosition.x}/${startPosition.y}/${direction}`);

  while (true) {
    const move = MOVES[direction];

    const nextX = x + move.x;
    const nextY = y + move.y;

    // If out of bound we can stop
    if (nextX < 0 || nextX >= maxX || nextY < 0 || nextY >= maxY) {
      break;
    }

    if (map[nextY][nextX] === '#') {
      // Tourner à droite
      const currentDirectionIndex = allDirection.indexOf(direction);
      direction =
        allDirection[(currentDirectionIndex + 1) % allDirection.length];
    } else {
      // Avancer dans la direction actuelle
      x = nextX;
      y = nextY;
      if (!positionGuard.has(`${x}/${y}/${direction}`)) {
        positionGuard.add(`${x}/${y}/${direction}`);
      } else {
        return { positionGuard, exitMap: false };
      }
    }
  }
  return { positionGuard, exitMap: true };
}

function replaceCharAtIndex(str: string, index: number, newChar: string) {
  if (index < 0 || index >= str.length) {
    throw new Error('Index out of bounds');
  }
  return str.slice(0, index) + newChar + str.slice(index + 1);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const position = findStartPosition(input);

  const positionVisited = exploreMap(input, position);

  return Array.from(positionVisited.positionGuard).reduce((acc, curr) => {
    const parts = curr.split('/');
    acc.add(`${parts[0]}/${parts[1]}`);
    return acc;
  }, new Set()).size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const position = findStartPosition(input);

  const positionVisited = exploreMap(input, position);

  const onlyPositions = Array.from(positionVisited.positionGuard).reduce(
    (acc, curr) => {
      const parts = curr.split('/');
      if (Number(parts[1]) !== position.y || Number(parts[0]) !== position.x) {
        acc.add(`${parts[0]}/${parts[1]}`);
      }
      return acc;
    },
    new Set<string>(),
  );

  return Array.from(onlyPositions).reduce((acc, curr, idx) => {
    if (idx === 0) return acc;
    const parts = curr.split('/');
    const [x, y] = [Number(parts[0]), Number(parts[1])];
    let modifiedMap = [...input];
    modifiedMap[y] = replaceCharAtIndex(modifiedMap[y], x, '#');

    const test = exploreMap(modifiedMap, position);

    if (test.exitMap === false) {
      return acc + 1;
    }

    return acc;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 41,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
